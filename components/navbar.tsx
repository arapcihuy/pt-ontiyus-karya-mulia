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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full mt-2">
                <Link href="/kontak" onClick={() => setIsOpen(false)}>
                  <Phone className="w-4 h-4 mr-2" />
                  {t("nav.contact")}
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
