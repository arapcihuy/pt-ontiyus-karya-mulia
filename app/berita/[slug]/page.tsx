"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { getNewsById } from "@/lib/news-data"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

type ApiNews = {
  id: string
  title: string
  excerpt?: string
  content?: string
  image?: string
  category?: string
  date?: string
  slug?: string
}

export default function NewsArticlePage() {
  const { t } = useLanguage()
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Coba ambil dari API dulu
        const ts = Date.now()
        const res = await fetch(`/api/news?_=${ts}`, { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          const apiArticle = data.news?.find((n: ApiNews) => (n.slug || n.id) === slug)
          if (apiArticle) {
            setArticle({
              id: apiArticle.slug || apiArticle.id,
              title: apiArticle.title,
              excerpt: apiArticle.excerpt || "",
              content: apiArticle.content || apiArticle.excerpt || "",
              date: apiArticle.date || "",
              category: apiArticle.category || "",
              image: apiArticle.image,
            })
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.error("[berita-detail] fetch error", err)
      }

      // Fallback ke data statis jika tidak ditemukan di API
      const staticArticle = getNewsById(slug)
      if (staticArticle) {
        setArticle(staticArticle)
      }
      setLoading(false)
    }

    fetchNews()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="h-4 bg-muted rounded animate-pulse mb-6 w-24" />
              <div className="h-6 bg-muted rounded animate-pulse mb-4 w-32" />
              <div className="h-10 bg-muted rounded animate-pulse w-3/4" />
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-[16/9] rounded-xl bg-muted animate-pulse" />
            </div>
          </div>
        </section>

        <section className="py-8 lg:py-12 min-h-screen">
          <div className="container mx-auto px-4">
            <article className="max-w-3xl mx-auto space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </article>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Article Header */}
      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/berita"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("newsPage.backToNews")}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <span className="text-sm text-muted-foreground">{article.date}</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight">{article.title}</h1>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph: string, index: number) => {
                // Parse URLs and convert them to clickable links
                const urlRegex = /(https?:\/\/[^\s]+)/g
                const parts = paragraph.split(urlRegex)
                
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                    {parts.map((part: string, partIndex: number) => 
                      urlRegex.test(part) ? (
                        <a 
                          key={partIndex}
                          href={part} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 underline transition-colors"
                        >
                          {part}
                        </a>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )
              })}
            </div>
          </article>
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-12 lg:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="pt-8 border-t border-border">
              <Link
                href="/berita"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("newsPage.backToAllNews")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
