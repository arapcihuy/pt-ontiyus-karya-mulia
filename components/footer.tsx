"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const footerLinksData = {
  produk: [
    { labelKey: "products.implants.title", href: "/produk#implan" },
    { labelKey: "products.prosthetics.title", href: "/produk#prostetik" },
  ],
  perusahaan: [
    { labelKey: "nav.about", href: "/tentang" },
    { labelKey: "nav.news", href: "/berita" },
    { labelKey: "nav.contact", href: "/kontak" },
  ],
}

const socialLinks = [
  { icon: Youtube, href: "https://www.youtube.com/channel/UCKPEC0hfS8khX6RFLviaTDA", label: "YouTube" },
  { icon: Facebook, href: "https://www.facebook.com/ontiyus.karyamulia.9/about", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/ontiyuskaryamulia/", label: "Instagram" },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/ontiyus-logo-full.png"
                  alt="Logo Ontiyus"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="font-bold">PT. Ontiyus Karya Mulia</p>
                <p className="text-xs text-primary-foreground/70">Produsen Alat Kesehatan</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4 max-w-sm">
              {t("footer.description")}
            </p>

            <div className="space-y-2 mb-6 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-foreground/70" />
                <a
                  href="https://www.google.com/maps/place/Jl+Sambisari,+Duwet,+Sendangadi,+Mlati,+Sleman,+Yogyakarta+55511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Jl. Sambisari, Duwet, Sendangadi, Mlati, Sleman, Yogyakarta 55511
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-primary-foreground/70" />
                <a href="tel:+62274291" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  (0274) 2887324
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-primary-foreground/70" />
                <a
                  href="mailto:ontiyuskaryamulia@gmail.com"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  ontiyuskaryamulia@gmail.com
                </a>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-primary-foreground/70 mb-2">{t("footer.operatingHours")}</p>
              <p className="text-sm text-primary-foreground/80">{t("footer.schedule")}</p>
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">{t("footer.products")}</h4>
            <ul className="space-y-3">
              {footerLinksData.produk.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {footerLinksData.perusahaan.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} PT. Ontiyus Karya Mulia. {t("footer.copyright")}
            </p>
            <div className="flex gap-6">
              <Link
                href="/kebijakan-privasi"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/syarat-ketentuan"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
