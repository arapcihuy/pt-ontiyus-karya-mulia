"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import * as React from "react"
import { newsArticles } from "@/lib/news-data"

type ApiNews = {
  id: string
  title: string
  excerpt?: string
  image?: string
  category?: string
  date?: string
  slug?: string
}

export default function NewsPage() {
  const { t } = useLanguage()
  const [apiNews, setApiNews] = useState<ApiNews[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const ts = Date.now()
    fetch(`/api/news?_=${ts}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "")
          throw new Error(`API error ${r.status}: ${text}`)
        }
        return r.json()
      })
      .then((data) => {
        console.log("[berita] fetched news", data?.news?.length || 0)
        setApiNews(data.news || [])
      })
      .catch((err) => {
        console.error("[berita] fetch error", err)
      })
      .finally(() => setLoaded(true))
  }, [])
  
  // Berita fallback (berita lama tetap ada) - diload dulu untuk menghindari flash
  const newsFallback = React.useMemo(() => {
    return newsArticles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      date: article.date,
      category: article.category,
      image: article.image,
      content: article.content,
    }))
  }, [])

  // Gabungkan berita API dengan berita fallback
  const allNewsArticles = React.useMemo(() => [
    ...apiNews.map((n) => ({
      id: n.slug || n.id,
      title: n.title,
      excerpt: n.excerpt || "",
      date: n.date || "",
      category: n.category || "",
      image: n.image,
      content: "",
    })),
    ...newsFallback,
  ], [apiNews, newsFallback])
  
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t("newsPage.hero.title")}
              <span className="block text-lg lg:text-xl font-normal text-muted-foreground mt-2">{t("newsPage.hero.subtitle")}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("newsPage.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 lg:py-20 min-h-screen">
        <div className="container mx-auto px-4">
          {!loaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden border-border/50">
                  <div className="aspect-[16/10] bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded animate-pulse mb-3 w-1/3" />
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allNewsArticles.map((article) => (
              <Card
                key={article.id}
                className="group overflow-hidden border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>
                  <Link
                    href={`/berita/${article.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {t("newsPage.readMore")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{t("contact.title")}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors"
          >
            {t("nav.contact")}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
