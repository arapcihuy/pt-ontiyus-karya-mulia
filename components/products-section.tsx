"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bone, Wrench } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const products = [
  {
    icon: Bone,
    titleKey: "products.implants.title",
    descriptionKey: "products.implants.description",
    href: "/produk#implan",
  },
  {
    icon: Wrench,
    titleKey: "products.prosthetics.title",
    descriptionKey: "products.prosthetics.description",
    href: "/produk#prostetik",
  },
]

export function ProductsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{t("products.title")}</h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg">
            {t("products.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {products.map((product) => (
            <Card
              key={product.titleKey}
              className="bg-card border-border hover:shadow-lg transition-shadow duration-300 group"
            >
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <product.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg text-card-foreground">{t(product.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">{t(product.descriptionKey)}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 text-xs sm:text-sm" asChild>
                  <Link href={product.href}>
                    {t("products.implants.details")}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
