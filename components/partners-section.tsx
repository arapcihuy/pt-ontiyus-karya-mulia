"use client"

import { Award } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const partners = [
  { name: "RS Harapan Sehat", logo: "/hospital-logo.png" },
  { name: "Klinik Medika Prima", logo: "/clinic-logo.jpg" },
  { name: "Lab Diagnostik Utama", logo: "/laboratory-logo.jpg" },
  { name: "RS Kasih Ibu", logo: "/healthcare-logo.png" },
  { name: "Puskesmas Sejahtera", logo: "/medical-center-logo.png" },
  { name: "RS Mitra Keluarga", logo: "/family-hospital-logo.jpg" },
]

export function PartnersSection() {
  const { t } = useLanguage()
  
  const certifications = [
    { name: t("partners.certifications.iso13485.name"), description: t("partners.certifications.iso13485.description") },
    { name: t("partners.certifications.kemenkes.name"), description: t("partners.certifications.kemenkes.description") },
    { name: t("partners.certifications.sni.name"), description: t("partners.certifications.sni.description") },
  ]
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{t("partners.title")}</h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg">
            {t("partners.subtitle")}
          </p>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12 lg:mb-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 flex items-center justify-center border border-border hover:shadow-md transition-shadow"
            >
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="max-h-10 sm:max-h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-secondary rounded-xl sm:rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-3 sm:gap-4 text-center md:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm sm:text-base">{cert.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
