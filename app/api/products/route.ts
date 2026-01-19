import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { verifyAdminPassword } from "@/lib/auth"
import { revalidatePath } from "next/cache"

type ProductItem = {
  id: string
  name: string
  description: string
  image?: string
  category?: string
  tags?: string[]
}

const DATA_FILE = path.join(process.cwd(), "data", "products.json")

// Pastikan file dan direktori ada
async function ensureDataFile() {
  try {
    const dir = path.dirname(DATA_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    try {
      await fs.access(DATA_FILE)
    } catch {
      // File tidak ada, buat file baru
      await fs.writeFile(DATA_FILE, JSON.stringify({ products: [] }, null, 2), "utf-8")
    }
  } catch (e) {
    console.error("Error ensuring data file:", e)
  }
}

// Validasi input
function validateProductInput(name: any, description: any, category?: any, image?: any, tags?: any): string | null {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "Name harus diisi dan tipe string"
  }
  if (name.length > 200) {
    return "Name maksimal 200 karakter"
  }
  
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return "Description harus diisi dan tipe string"
  }
  if (description.length > 2000) {
    return "Description maksimal 2000 karakter"
  }
  
  if (category) {
    if (typeof category !== "string" || !category.match(/^[a-z]+$/)) {
      return "Category hanya boleh huruf kecil"
    }
    if (category.length > 50) {
      return "Category maksimal 50 karakter"
    }
  }
  
  if (image && typeof image !== "string") {
    return "Image harus URL string"
  }
  if (image && image.length > 500) {
    return "Image URL terlalu panjang"
  }
  
  if (tags && !Array.isArray(tags)) {
    return "Tags harus array"
  }
  if (tags && tags.length > 10) {
    return "Maksimal 10 tags"
  }
  if (tags && tags.some((t: any) => typeof t !== "string" || t.length > 50)) {
    return "Setiap tag harus string max 50 karakter"
  }
  
  return null
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const products: ProductItem[] = parsed.products || []
    
    return NextResponse.json({ products }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      }
    })
  } catch (e) {
    console.error("GET products error:", e)
    return NextResponse.json({ products: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    // Cek auth
    const isAuthorized = await verifyAdminPassword(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, category, tags } = body

    // Validasi input
    const validationError = validateProductInput(name, description, category, image, tags)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Pastikan file ada
    await ensureDataFile()

    // Retry logic untuk membaca file
    let products: ProductItem[] = []
    let readSuccess = false
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const data = await fs.readFile(DATA_FILE, "utf-8")
        const parsed = JSON.parse(data)
        products = Array.isArray(parsed.products) ? parsed.products : []
        console.log(`[Attempt ${attempt + 1}] Existing products count:`, products.length)
        readSuccess = true
        break
      } catch (e) {
        console.error(`[Attempt ${attempt + 1}] Error reading file:`, e)
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    }

    if (!readSuccess) {
      console.log("Failed to read existing file, starting with empty array")
      products = []
    }

    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      image: image?.trim() || undefined,
      category: category?.trim().toLowerCase() || undefined,
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
    }

    // Tambahkan produk baru ke array yang sudah ada
    products.push(newProduct)
    console.log("New products count after adding:", products.length)
    console.log("All products:", products.map(p => ({ id: p.id, name: p.name })))
    
    // Simpan semua produk dengan atomic write dan retry
    const jsonContent = JSON.stringify({ products }, null, 2)
    let writeSuccess = false
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`[Write attempt ${attempt + 1}] Writing ${products.length} products`)
        
        // Direct write (lebih sederhana dan reliable untuk Next.js)
        await fs.writeFile(DATA_FILE, jsonContent, { encoding: "utf-8", flag: "w" })
        
        // Tunggu sebentar untuk memastikan flush
        await new Promise(resolve => setTimeout(resolve, 50))
        
        console.log(`[Write attempt ${attempt + 1}] File saved successfully`)
        writeSuccess = true
        break
      } catch (writeErr) {
        console.error(`[Write attempt ${attempt + 1}] Error writing file:`, writeErr)
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    }
    
    if (!writeSuccess) {
      return NextResponse.json({ error: "Gagal menyimpan data setelah 3 percobaan" }, { status: 500 })
    }
    
    // Verifikasi data tersimpan dengan retry
    let verifySuccess = false
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const verify = await fs.readFile(DATA_FILE, "utf-8")
        const verifyParsed = JSON.parse(verify)
        console.log(`[Verify attempt ${attempt + 1}] Verified products count:`, verifyParsed.products?.length || 0)
        
        if (verifyParsed.products?.length === products.length) {
          verifySuccess = true
          break
        } else {
          console.warn(`[Verify attempt ${attempt + 1}] Mismatch! Expected ${products.length}, got ${verifyParsed.products?.length}`)
        }
      } catch (e) {
        console.error(`[Verify attempt ${attempt + 1}] Verification error:`, e)
      }
      
      if (attempt < 2) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    if (!verifySuccess) {
      console.error("CRITICAL: Data may not be saved correctly!")
    }

    // Revalidate halaman produk agar data terbaru muncul
    revalidatePath("/produk")
    revalidatePath("/")

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (e) {
    console.error("Product POST error:", e)
    return NextResponse.json({ error: "Gagal menambah produk" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Cek auth
    const isAuthorized = await verifyAdminPassword(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id || typeof id !== "string" || id.length === 0) {
      return NextResponse.json({ error: "ID produk tidak valid" }, { status: 400 })
    }

    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const products: ProductItem[] = parsed.products || []

    const filteredProducts = products.filter((p) => p.id !== id)

    if (filteredProducts.length === products.length) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    await fs.writeFile(DATA_FILE, JSON.stringify({ products: filteredProducts }, null, 2), "utf-8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error("Product DELETE error:", e)
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Cek auth
    const isAuthorized = await verifyAdminPassword(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, image, category, tags } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID produk tidak valid" }, { status: 400 })
    }

    // Validasi input
    const validationError = validateProductInput(name, description, category, image, tags)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    await ensureDataFile()

    // Baca produk yang ada
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const products: ProductItem[] = parsed.products || []

    // Cari produk yang akan di-update
    const productIndex = products.findIndex((p) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 })
    }

    // Update produk
    products[productIndex] = {
      ...products[productIndex],
      name: name.trim(),
      description: description.trim(),
      image: image || undefined,
      category: category?.trim() || undefined,
      tags: tags || undefined,
    }

    // Simpan ke file
    await fs.writeFile(DATA_FILE, JSON.stringify({ products }, null, 2), "utf-8")

    revalidatePath("/produk")
    revalidatePath("/admin")

    return NextResponse.json({ product: products[productIndex] }, { status: 200 })
  } catch (e) {
    console.error("Product PUT error:", e)
    return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 500 })
  }
}
