"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBooks } from "@/lib/books-data"
import { useLanguage } from "@/lib/language-context"

export default function BooksPage() {
  const { t, language } = useLanguage()
  const books = getBooks(language)
  
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{t("booksPage.hero.title")}</h1>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("booksPage.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {books.map((book) => (
              <Card
                key={book.id}
                className="bg-card border-border hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex flex-col"
              >
                {/* Book Cover */}
                <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center overflow-hidden relative">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader>
                  <CardTitle className="text-base font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-2">{t("books.author")} {book.author}</p>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">{t("books.isbn")}</p>
                      <p className="text-xs text-foreground font-mono">{book.isbn}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">{t("books.publisher")}</p>
                      <p className="text-xs text-foreground">{book.publisher}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">{t("books.pages")}</p>
                        <p className="font-medium">{book.pageCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("books.year")}</p>
                        <p className="font-medium">{book.year}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">{t("books.price")}</p>
                      <p className="text-base font-bold text-primary">Rp {book.price.toLocaleString("id-ID")}</p>
                    </div>

                    {book.availability && (
                      <Badge className="bg-green-500/10 text-green-700 w-fit">{t("books.availability")}</Badge>
                    )}
                  </div>
                </CardContent>

                <div className="p-4 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-xs sm:text-sm" asChild>
                    <Link href={`/buku/${book.id}`}>
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      {t("booksPage.orderInfo")}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">{t("booksPage.aboutPublications")}</h2>
            <div className="prose prose-sm sm:prose max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("booksPage.aboutDesc1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("booksPage.aboutDesc2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
