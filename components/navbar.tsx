"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/language-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/produk" },
    { label: t("nav.about"), href: "/tentang" },
    { label: t("nav.books"), href: "/buku" },
    { label: t("nav.news"), href: "/berita" },
    { label: t("nav.contact"), href: "/kontak" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="/ontiyus-logo-full.png"
                alt="Logo Ontiyus"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="font-bold text-foreground text-xs sm:text-sm lg:text-base truncate">PT. Ontiyus Karya Mulia</p>
              <p className="text-muted-foreground text-[10px] sm:text-xs truncate">Alat Kesehatan Terpercaya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Language Switcher */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/kontak">
                <Phone className="w-4 h-4 mr-2" />
                {t("nav.contact")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation with enhanced animation & overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/65 to-background/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute left-0 right-0 top-16 mx-4 rounded-xl border border-border bg-card/95 shadow-2xl origin-top will-change-transform will-change-opacity transition-all duration-500 ease-out ${
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
            }`}
          >
            <div className="py-4">
              <nav className="flex flex-col gap-3">
                {navItems.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium text-foreground/90 hover:text-primary transition-all duration-300 ease-out px-4 ${
                      isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="px-4">
                  <Button
                    asChild
                    className={`bg-accent hover:bg-accent/90 text-accent-foreground w-full mt-2 transition-all duration-300 ease-out ${
                      isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/kontak">
                      <Phone className="w-4 h-4 mr-2" />
                      {t("nav.contact")}
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
