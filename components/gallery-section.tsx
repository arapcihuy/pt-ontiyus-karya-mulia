"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const galleries = [
  {
    id: "1",
    title: "Fasilitas Produksi",
    description: "Workshop dan fasilitas manufaktur modern",
    image: "/gallery/production-facility.jpg",
  },
  {
    id: "2",
    title: "Alat Kesehatan",
    description: "Produk alat kesehatan berkualitas tinggi",
    image: "/gallery/medical-equipment.jpg",
  },
  {
    id: "3",
    title: "Peralatan Penelitian",
    description: "Instrumen laboratorium presisi tinggi",
    image: "/gallery/research-equipment.jpg",
  },
  {
    id: "4",
    title: "Kolaborasi Akademis",
    description: "Kerjasama dengan Universitas Gadjah Mada",
    image: "/gallery/academic-collab.jpg",
  },
  {
    id: "5",
    title: "Tim Ahli",
    description: "Tim profesional dan berpengalaman",
    image: "/gallery/expert-team.jpg",
  },
  {
    id: "6",
    title: "Layanan Konsultasi",
    description: "Dukungan teknis dan konsultasi engineering",
    image: "/gallery/consultation.jpg",
  },
]

export function GallerySection() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleries.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === galleries.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{t("gallery.title")}</h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg">
            {t("gallery.subtitle")}
          </p>
        </div>

        {/* Featured Gallery */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-[20/9] bg-background rounded-lg sm:rounded-xl overflow-hidden group">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm sm:text-base">{galleries[currentIndex].title}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 sm:p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white">{galleries[currentIndex].title}</h3>
              <p className="text-white/80 text-sm sm:text-base">{galleries[currentIndex].description}</p>
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {galleries.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? "ring-2 ring-primary scale-105"
                  : "opacity-60 hover:opacity-100 ring-1 ring-border"
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary/40" />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2 truncate">{item.title}</p>
            </button>
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-6 sm:mt-8 text-muted-foreground">
          {currentIndex + 1} / {galleries.length}
        </div>
      </div>
    </section>
  )
}
