"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center pt-16 sm:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="http://ontiyus.com/wp-content/uploads/2020/03/20200310_1031022-scaled-e1583818069725.jpg" 
          alt="Peralatan medis modern" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight text-balance">
            {t("hero.title")}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold w-full sm:w-auto" asChild>
              <Link href="/produk">
                {t("hero.viewProducts")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 w-full sm:w-auto"
              asChild
            >
              <Link href="/kontak">{t("hero.contactUs")}</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-6 sm:mt-8 text-primary-foreground/80">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{t("hero.tagline")}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
