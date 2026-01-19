"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
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

export function NewsSection() {
  const { t, translations } = useLanguage()
  const [apiNews, setApiNews] = useState<ApiNews[]>([])

  useEffect(() => {
    const ts = Date.now()
    fetch(`/api/news?_=${ts}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => setApiNews(data?.news || []))
      .catch(() => {})
  }, [])

  const localizedItems = translations?.news?.items || []
  const localizedMap = useMemo(
    () => Object.fromEntries(localizedItems.map((item: any) => [item.id, item])),
    [localizedItems]
  )

  const latestNews = useMemo(() => {
    const merged = [
      ...apiNews.map((n) => ({
        id: n.slug || n.id,
        title: n.title,
        excerpt: n.excerpt || "",
        date: n.date || "",
        category: n.category || "",
        image: n.image,
      })),
      ...newsArticles,
    ]
    return merged
      .slice(0, 3)
      .map((item) => ({
        ...item,
        title: localizedMap[item.id]?.title || item.title,
        excerpt: localizedMap[item.id]?.excerpt || item.excerpt,
      }))
  }, [apiNews, localizedMap])
  
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
          {latestNews.map((item) => (
            <Card
              key={item.id}
              className="bg-card border-border hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-medium text-primary/80 uppercase">{item.category}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <CardTitle className="text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{item.excerpt}</p>
                <Link
                  href={`/berita/${item.id}`}
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
