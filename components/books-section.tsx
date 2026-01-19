"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import Image from "next/image"
import { getBooks } from "@/lib/books-data"
import { useLanguage } from "@/lib/language-context"

export function BooksSection() {
  const { t, language } = useLanguage()
  const books = getBooks(language)
  const featuredBooks = books.slice(0, 3)

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{t("books.title")}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg">
            {t("books.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8">
          {featuredBooks.map((book) => (
            <Card
              key={book.id}
              className="bg-card border-border hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
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
                <CardTitle className="text-base sm:text-lg text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">{t("books.author")} {book.author}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">{t("books.isbn")}:</span> {book.isbn}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">{t("books.price")}:</span> Rp {book.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-muted-foreground line-clamp-2">{book.description}</p>
                </div>
              </CardContent>

              <CardFooter>
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 text-xs sm:text-sm" asChild>
                  <Link href={`/buku/${book.id}`}>
                    {t("products.implants.details")}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/buku">
              {t("books.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
