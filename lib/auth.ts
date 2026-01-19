import { createHash } from "crypto"

// Middleware untuk auth dengan hashing yang lebih aman
export async function verifyAdminPassword(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return false

  // Pastikan format Bearer token
  if (!authHeader.startsWith("Bearer ")) return false

  const token = authHeader.replace("Bearer ", "")
  const adminPassword = process.env.ADMIN_PASSWORD
  
  // Jika ADMIN_PASSWORD tidak diset, tolak akses (fail-safe)
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables")
    return false
  }

  // Gunakan SHA-256 untuk hashing yang lebih aman
  const expectedToken = createHash("sha256").update(adminPassword).digest("base64")
  
  // Constant-time comparison untuk mencegah timing attacks
  return timingSafeEqual(token, expectedToken)
}

export function getAdminToken(): string {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD not set")
  }
  return createHash("sha256").update(adminPassword).digest("base64")
}

// Constant-time string comparison untuk mencegah timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
