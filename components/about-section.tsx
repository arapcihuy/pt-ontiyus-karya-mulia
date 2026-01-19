"use client"

import { CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function AboutSection() {
  const { t } = useLanguage()
  
  const highlights = t("about.highlights") as string[]

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">{t("about.title")}</h2>
            <div className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                {t("about.description")}
              </p>
              <p>
                {t("about.mission")}
              </p>
              <p>
                {t("about.commitment")}
              </p>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
            <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-4 sm:mb-6">{t("about.why")}</h3>
            <ul className="space-y-3 sm:space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-card-foreground text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
