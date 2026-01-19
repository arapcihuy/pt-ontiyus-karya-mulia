"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getBooks } from "@/lib/books-data"
import { notFound, useParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"

export default function BookDetailPage() {
  const { t, language } = useLanguage()
  const params = useParams()
  const books = getBooks(language)
  const book = books.find((b) => b.id === params.id)

  if (!book) {
    notFound()
  }

  const relatedBooks = books.filter((b) => b.id !== params.id).slice(0, 3)

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/buku" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("booksPage.backToPublications")}</span>
          </Link>
        </div>
      </section>

      {/* Book Detail */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="aspect-[2/3] bg-secondary rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center sticky top-20 relative">
                <Image
                  src={book.image}
                  alt={book.title}
                  width={300}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{book.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{t("booksPage.by")} {book.author}</p>
                {book.availability && (
                  <Badge className="bg-green-500/10 text-green-700 mb-6">{t("booksPage.availability")}</Badge>
                )}
              </div>

              {/* Price */}
              <div className="bg-primary/5 rounded-lg p-4 sm:p-6 mb-6">
                <p className="text-muted-foreground text-sm mb-2">{t("booksPage.priceLabel")}</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  Rp {book.price.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-3">{t("booksPage.aboutBook")}</h2>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-4">{t("booksPage.specifications")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-secondary border-border">
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground mb-1">{t("booksPage.isbn")}</p>
                      <p className="font-mono text-sm font-bold">{book.isbn}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-border">
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground mb-1">{t("booksPage.publisher")}</p>
                      <p className="text-sm font-bold">{book.publisher}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-border">
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground mb-1">{t("booksPage.yearPublished")}</p>
                      <p className="text-sm font-bold">{book.year}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-border">
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground mb-1">{t("booksPage.pages")}</p>
                      <p className="text-sm font-bold">{book.pageCount} {t("booksPage.pages").toLowerCase()}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary border-border col-span-2">
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted-foreground mb-1">{t("booksPage.size")}</p>
                      <p className="text-sm font-bold">{book.dimensions}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-base sm:text-lg py-6 sm:py-8" asChild>
                <Link href="/kontak">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t("booksPage.orderNow")}
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {t("booksPage.bulkOrderHelp")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">{t("booksPage.relatedBooks")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {relatedBooks.map((b) => (
                  <Card key={b.id} className="bg-card border-border hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={b.image}
                      alt={b.title}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>                  <CardHeader>
                    <h3 className="font-bold text-base text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">{t("booksPage.by")} {b.author}</p>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm font-bold text-primary mb-4">Rp {b.price.toLocaleString("id-ID")}</p>
                    <Button variant="outline" className="w-full text-xs" asChild>
                      <Link href={`/buku/${b.id}`}>{t("booksPage.viewDetails")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
