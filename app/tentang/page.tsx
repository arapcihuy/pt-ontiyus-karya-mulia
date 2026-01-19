"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import {
  Target,
  Eye,
  Lightbulb,
  Wrench,
  Bone,
  Handshake,
  GraduationCap,
  Users,
  FlaskConical,
  Shield,
} from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

const expertise = [
  {
    icon: Bone,
    titleKey: "aboutPage.expertiseItems.0.title",
    descriptionKey: "aboutPage.expertiseItems.0.description",
  },
  {
    icon: Wrench,
    titleKey: "aboutPage.expertiseItems.1.title",
    descriptionKey: "aboutPage.expertiseItems.1.description",
  },
  {
    icon: FlaskConical,
    titleKey: "aboutPage.expertiseItems.2.title",
    descriptionKey: "aboutPage.expertiseItems.2.description",
  },
  {
    icon: GraduationCap,
    titleKey: "aboutPage.expertiseItems.3.title",
    descriptionKey: "aboutPage.expertiseItems.3.description",
  },
]

export default function AboutPage() {
  const { t } = useLanguage()
  
  const milestones = t("aboutPage.milestones") as Array<{year: string, title: string, description: string}>
  
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t("aboutPage.hero.title")}
              <span className="block text-lg lg:text-xl font-normal text-muted-foreground mt-2">{t("aboutPage.hero.subtitle")}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("aboutPage.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story - Updated with real company history */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">{t("aboutPage.history.title")}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong>Ontiyus Karya Mulia</strong> {t("aboutPage.history.p1").replace("Ontiyus Karya Mulia adalah perusahaan berbentuk perseroan terbatas. Perusahaan ini didirikan pada tanggal ", "")}
                </p>
                <p>
                  {t("aboutPage.history.p2")}
                </p>
                <p>
                  {t("aboutPage.history.p3")}
                </p>
                <p>
                  {t("aboutPage.history.p4")}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
                <Image
                  src="/ontiyus-logo-full.png"
                  alt="Logo PT. Ontiyus Karya Mulia"
                  width={300}
                  height={300}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">5+</p>
                <p className="text-sm text-primary-foreground/80">{t("aboutPage.history.years")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Updated with real vision & mission from WordPress */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t("aboutPage.vision.title")}
                  <span className="text-sm font-normal text-muted-foreground ml-2">/ {t("aboutPage.vision.subtitle")}</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {t("aboutPage.vision.content")}
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t("aboutPage.mission.title")}
                  <span className="text-sm font-normal text-muted-foreground ml-2">/ {t("aboutPage.mission.subtitle")}</span>
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="font-medium">
                      {t("aboutPage.mission.item1")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span className="font-medium">
                      {t("aboutPage.mission.item2")}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {t("aboutPage.values.title")}
              <span className="text-lg font-normal text-muted-foreground ml-2">/ {t("aboutPage.values.subtitle")}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{t("aboutPage.values.quality.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("aboutPage.values.quality.description")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{t("aboutPage.values.innovation.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("aboutPage.values.innovation.description")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{t("aboutPage.values.integrity.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("aboutPage.values.integrity.description")}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{t("aboutPage.values.care.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("aboutPage.values.care.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {t("aboutPage.expertise.title")}
              <span className="text-lg font-normal text-muted-foreground ml-2">/ {t("aboutPage.expertise.subtitle")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("aboutPage.expertise.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{t(item.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {t("aboutPage.timeline.title")}
              <span className="text-lg font-normal text-muted-foreground ml-2">/ {t("aboutPage.timeline.subtitle")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("aboutPage.timeline.description")}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

            <div className="space-y-8 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative lg:flex lg:items-center lg:mb-12">
                  {/* Mobile Year Badge */}
                  <div className="lg:hidden mb-2">
                    <span className="inline-flex px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className={`lg:w-1/2 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12 lg:ml-auto lg:text-left"}`}
                  >
                    <Card className="border-border/50">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Desktop Year Badge */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary text-primary-foreground rounded-full items-center justify-center font-bold shadow-lg">
                    {milestone.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sertifikat Section - Added certificates section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Sertifikat
              <span className="text-lg font-normal text-muted-foreground ml-2">/ Certificates</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sertifikasi yang dimiliki PT. Ontiyus Karya Mulia sebagai bukti komitmen terhadap kualitas dan standar.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-card rounded-xl shadow-md overflow-hidden">
              <Image
                src="http://ontiyus.com/wp-content/uploads/2021/12/0001-195x300.jpg"
                alt="Sertifikat 1"
                width={195}
                height={300}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="bg-card rounded-xl shadow-md overflow-hidden">
              <Image
                src="http://ontiyus.com/wp-content/uploads/2021/12/0001-1-194x300.jpg"
                alt="Sertifikat 2"
                width={194}
                height={300}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary-foreground">50+</p>
              <p className="text-primary-foreground/80 text-sm">Produk & Layanan</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary-foreground">100+</p>
              <p className="text-primary-foreground/80 text-sm">{t("aboutPage.stats.clients")}</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary-foreground">15+</p>
              <p className="text-primary-foreground/80 text-sm">{t("aboutPage.stats.provinces")}</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold text-primary-foreground">5+</p>
              <p className="text-primary-foreground/80 text-sm">{t("aboutPage.stats.experience")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
