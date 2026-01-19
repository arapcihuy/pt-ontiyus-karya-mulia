"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const news = [
  {
    title: "PT. Ontiyus Karya Mulia Meluncurkan Produk Monitor Pasien Terbaru",
    summary:
      "Inovasi terbaru dalam pemantauan vital sign dengan fitur wireless dan integrasi sistem informasi rumah sakit.",
    href: "/berita/peluncuran-monitor-pasien",
  },
  {
    title: "Kerjasama dengan 50 Rumah Sakit Baru di Wilayah Jawa Timur",
    summary: "Ekspansi jaringan distribusi untuk menjangkau lebih banyak fasilitas kesehatan di Indonesia Timur.",
    href: "/berita/ekspansi-jawa-timur",
  },
  {
    title: "Mendapatkan Sertifikasi ISO 13485:2024 Terbaru",
    summary: "Komitmen berkelanjutan terhadap standar mutu internasional dalam produksi alat kesehatan.",
    href: "/berita/sertifikasi-iso",
  },
]

export function NewsSection() {
  const { t } = useLanguage()
  
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{t("news.title")}</h2>
            <p className="mt-2 sm:mt-4 text-muted-foreground text-base sm:text-lg">{t("news.subtitle")}</p>
          </div>
          <Button variant="outline" className="bg-transparent w-full sm:w-auto" asChild>
            <Link href="/berita">
              {t("news.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {news.map((item) => (
            <Card
              key={item.title}
              className="bg-card border-border hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{item.summary}</p>
                <Link
                  href={item.href}
                  className="text-primary text-sm font-medium hover:underline inline-flex items-center"
                >
                  {t("news.readMore")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
