import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { verifyAdminPassword } from "@/lib/auth"
import { revalidatePath } from "next/cache"

type NewsItem = {
  id: string
  title: string
  excerpt?: string
  image?: string
  category?: string
  date?: string
  slug?: string
}

const DATA_FILE = path.join(process.cwd(), "data", "news.json")

// Pastikan file dan direktori ada
async function ensureDataFile() {
  try {
    const dir = path.dirname(DATA_FILE)
    await fs.mkdir(dir, { recursive: true })
    
    try {
      await fs.access(DATA_FILE)
    } catch {
      // File tidak ada, buat file baru
      await fs.writeFile(DATA_FILE, JSON.stringify({ news: [] }, null, 2), "utf-8")
    }
  } catch (e) {
    console.error("Error ensuring data file:", e)
  }
}

// Validasi input
function validateNewsInput(title: any, excerpt?: any, image?: any, category?: any): string | null {
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return "Title harus diisi dan tipe string"
  }
  if (title.length > 300) {
    return "Title maksimal 300 karakter"
  }
  
  if (excerpt) {
    if (typeof excerpt !== "string") {
      return "Excerpt harus string"
    }
    if (excerpt.length > 1000) {
      return "Excerpt maksimal 1000 karakter"
    }
  }
  
  if (image && typeof image !== "string") {
    return "Image harus URL string"
  }
  if (image && image.length > 500) {
    return "Image URL terlalu panjang"
  }
  
  if (category) {
    if (typeof category !== "string" || !category.match(/^[a-z]+$/)) {
      return "Category hanya boleh huruf kecil"
    }
    if (category.length > 50) {
      return "Category maksimal 50 karakter"
    }
  }
  
  return null
}

export async function GET() {
  try {
    await ensureDataFile()
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const news: NewsItem[] = parsed.news || []
    
    return NextResponse.json({ news }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      }
    })
  } catch (e) {
    console.error("GET news error:", e)
    return NextResponse.json({ news: [] }, { status: 200 })
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
    const { title, excerpt, image, category, date, slug } = body

    // Validasi input
    const validationError = validateNewsInput(title, excerpt, image, category)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    // Pastikan file ada
    await ensureDataFile()

    // Baca data yang sudah ada
    let news: NewsItem[] = []
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8")
      const parsed = JSON.parse(data)
      news = parsed.news || []
      console.log("Existing news count:", news.length)
    } catch (e) {
      console.log("No existing news file, creating new one")
      news = []
    }

    const newNews: NewsItem = {
      id: Date.now().toString(),
      title: title.trim(),
      excerpt: excerpt?.trim() || undefined,
      image: image?.trim() || undefined,
      category: category?.trim().toLowerCase() || undefined,
      date: date || new Date().toISOString(),
      slug: slug || title.toLowerCase().replace(/\s+/g, "-").substring(0, 100),
    }

    // Tambahkan berita baru ke array yang sudah ada
    news.push(newNews)
    console.log("New news count after adding:", news.length)
    
    // Simpan semua berita
    const jsonContent = JSON.stringify({ news }, null, 2)
    await fs.writeFile(DATA_FILE, jsonContent, "utf-8")
    
    // Verifikasi data tersimpan
    const verify = await fs.readFile(DATA_FILE, "utf-8")
    const verifyParsed = JSON.parse(verify)
    console.log("Verified news count after save:", verifyParsed.news?.length || 0)

    // Revalidate halaman berita agar data terbaru muncul
    revalidatePath("/berita")
    revalidatePath("/")

    return NextResponse.json({ success: true, news: newNews }, { status: 201 })
  } catch (e) {
    console.error("News POST error:", e)
    return NextResponse.json({ error: "Gagal menambah berita" }, { status: 500 })
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
      return NextResponse.json({ error: "ID berita tidak valid" }, { status: 400 })
    }

    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const news: NewsItem[] = parsed.news || []

    const filteredNews = news.filter((n) => n.id !== id)

    if (filteredNews.length === news.length) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    await fs.writeFile(DATA_FILE, JSON.stringify({ news: filteredNews }, null, 2), "utf-8")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error("News DELETE error:", e)
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 })
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
    const { id, title, excerpt, image, category } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID berita tidak valid" }, { status: 400 })
    }

    // Validasi input
    const validationError = validateNewsInput(title, excerpt, image, category)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    await ensureDataFile()

    // Baca berita yang ada
    const data = await fs.readFile(DATA_FILE, "utf-8")
    const parsed = JSON.parse(data)
    const news: NewsItem[] = parsed.news || []

    // Cari berita yang akan di-update
    const newsIndex = news.findIndex((n) => n.id === id)
    if (newsIndex === -1) {
      return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 })
    }

    // Update berita (keep id, slug, dan date yang lama)
    const oldNews = news[newsIndex]
    news[newsIndex] = {
      ...oldNews,
      title: title.trim(),
      excerpt: excerpt?.trim() || undefined,
      image: image || undefined,
      category: category?.trim() || undefined,
      // Jika title berubah, update slug juga
      slug: oldNews.slug || oldNews.id,
    }

    // Simpan ke file
    await fs.writeFile(DATA_FILE, JSON.stringify({ news }, null, 2), "utf-8")

    revalidatePath("/berita")
    revalidatePath("/admin")

    return NextResponse.json({ news: news[newsIndex] }, { status: 200 })
  } catch (e) {
    console.error("News PUT error:", e)
    return NextResponse.json({ error: "Gagal mengupdate berita" }, { status: 500 })
  }
}
