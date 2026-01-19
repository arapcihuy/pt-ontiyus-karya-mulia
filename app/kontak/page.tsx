"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address"),
      details: t("contact.addressDetails") as unknown as string[],
      link: "https://www.google.com/maps/place/Workshop+Inovasi/@-7.7274992,110.35603,15z/data=!4m5!3m4!1s0x0:0x370a46b25c3032f3!8m2!3d-7.7274992!4d110.35603",
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      details: ["(0274) 2887324"] as string[],
    },
    {
      icon: MessageCircle,
      title: t("contact.whatsapp"),
      details: ["081225716870"] as string[],
      link: "https://wa.me/6281225716870",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      details: ["ontiyuskaryamulia@gmail.com"] as string[],
      link: "mailto:ontiyuskaryamulia@gmail.com",
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      details: t("contact.operatingHours") as unknown as string[],
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t("contact.title")}
              <span className="block text-lg lg:text-xl font-normal text-muted-foreground mt-2">{t("contact.subtitle")}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("contact.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("contact.formTitle")}</h2>
              <p className="text-muted-foreground mb-8">
                {t("contact.formDesc")}
              </p>

              {isSubmitted ? (
                <Card className="border-accent/50 bg-accent/5">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{t("contact.submitted")}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t("contact.submittedDesc")}
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      {t("contact.sendAgain")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {t("contact.name")} <span className="text-destructive">*</span>
                      </Label>
                      <Input id="name" name="name" placeholder={t("contact.namePlaceholder")} required className="bg-card" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("contact.email")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t("contact.emailPlaceholder")}
                        required
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">{t("contact.company")}</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder={t("contact.companyPlaceholder")}
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
                      <Input id="phone" name="phone" type="tel" placeholder={t("contact.phonePlaceholder")} className="bg-card" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t("contact.subject")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder={t("contact.subjectPlaceholder")}
                      required
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t("contact.message")} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t("contact.messagePlaceholder")}
                      rows={6}
                      required
                      className="bg-card resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.send")}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("contact.contactInfo")}</h2>
              <p className="text-muted-foreground mb-8">
                {t("contact.contactInfoDesc")}
              </p>

              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 hover:opacity-80 transition-opacity"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            {item.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-sm text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                            {item.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-sm text-muted-foreground">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map - Added real Google Maps embed */}
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.4089046666!2d110.35384131477376!3d-7.727499294409684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59a4c85d0c67%3A0x370a46b25c3032f3!2sWorkshop%20Inovasi!5e0!3m2!1sen!2sid!4v1639000000000!5m2!1sen!2sid"
                  width="100%"
                  height="300"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-[4/3] border-0"
                  title="Lokasi PT. Ontiyus Karya Mulia"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{t("contact.faq")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("contact.faqDesc")}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("contact.q1")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.a1")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("contact.q2")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.a2")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("contact.q3")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.a3")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {t("contact.q4")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.a4")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
