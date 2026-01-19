import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { verifyAdminPassword } from "@/lib/auth"

// Magic numbers untuk validasi tipe file
const ALLOWED_SIGNATURES = {
  "ffd8ff": "jpg", // JPEG
  "89504e": "png", // PNG
  "474946": "gif", // GIF
  "52494646": "webp", // WEBP (RIFF)
}

// Whitelist ekstensi yang diperbolehkan
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"]

function getFileSignature(buffer: Buffer): string {
  // Ambil 4 byte pertama untuk magic number
  return buffer.toString("hex", 0, 4)
}

function sanitizeFilename(filename: string): string {
  // Hapus karakter berbahaya dan path traversal
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.\./g, "_")
}

export async function POST(request: Request) {
  try {
    // Cek auth
    const isAuthorized = await verifyAdminPassword(request)
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 })
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Gambar max 5MB" }, { status: 400 })
    }

    // Ambil bytes untuk validasi magic number
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validasi magic number (file signature)
    const signature = getFileSignature(buffer)
    const detectedType = Object.entries(ALLOWED_SIGNATURES).find(([sig]) =>
      signature.startsWith(sig)
    )?.[1]

    if (!detectedType) {
      return NextResponse.json(
        { error: "File bukan gambar valid (hanya JPG, PNG, GIF, WebP)" },
        { status: 400 }
      )
    }

    // Validasi ekstensi dari nama file
    const originalExt = file.name.split(".").pop()?.toLowerCase() || ""
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
      return NextResponse.json(
        { error: `Ekstensi file tidak diperbolehkan: .${originalExt}` },
        { status: 400 }
      )
    }

    // Generate nama file unik dengan sanitasi
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const safeExt = sanitizeFilename(detectedType) // Gunakan ekstensi dari magic number
    const filename = `${timestamp}_${randomStr}.${safeExt}`

    // Pastikan upload directory ada
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadDir, { recursive: true })

    // Validasi path untuk mencegah directory traversal
    const filepath = path.join(uploadDir, filename)
    if (!filepath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 })
    }

    // Simpan file
    await fs.writeFile(filepath, buffer)

    // Return URL relatif
    const imageUrl = `/uploads/${filename}`

    return NextResponse.json({ success: true, imageUrl }, { status: 200 })
  } catch (e) {
    console.error("Upload error:", e)
    // Jangan expose detail error ke client
    return NextResponse.json({ error: "Gagal upload gambar" }, { status: 500 })
  }
}
