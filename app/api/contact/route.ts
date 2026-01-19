import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

export const runtime = "nodejs"

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
  }

  const { name, email, company, phone, subject, message } = parsed.data

  const html = `
    <h2>Kontak Baru</h2>
    <p><strong>Nama:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Perusahaan:</strong> ${company || "-"}</p>
    <p><strong>Telepon:</strong> ${phone || "-"}</p>
    <p><strong>Subjek:</strong> ${subject}</p>
    <p><strong>Pesan:</strong></p>
    <p>${message.replace(/\n/g, "<br />")}</p>
  `

  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[Ontiyus] ${subject}`,
      html,
      text: `Nama: ${name}\nEmail: ${email}\nPerusahaan: ${company || "-"}\nTelepon: ${phone || "-"}\nSubjek: ${subject}\n\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to send email", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
