"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bone } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState, useMemo } from "react"

type ApiProduct = {
  id: string
  name: string
  description: string
  image?: string
  category?: string
  tags?: string[]
}

type CategoryDisplay = {
  id: string
  titleKey?: string
  subtitleKey?: string
  descriptionKey?: string
  title?: string
  subtitle?: string
  description?: string
  icon: any
  products: Array<{name: string, description: string, image?: string, tags?: string[]}>
}

export default function ProductsPage() {
  const { t } = useLanguage()
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([])
  const [loaded, setLoaded] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const ts = Date.now()
    fetch(`/api/products?_=${ts}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => "")
          throw new Error(`API error ${r.status}: ${text}`)
        }
        return r.json()
      })
      .then((data) => {
        console.log("[produk] fetched products", data?.products?.length || 0)
        setApiProducts(data.products || [])
        setFetchError(null)
      })
      .catch((err) => {
        console.error("[produk] fetch error", err)
        // jangan timpa data lama saat error
        setFetchError("Gagal memuat produk terbaru")
      })
      .finally(() => setLoaded(true))
  }, [])

  // Fallback products kalau API kosong
  const implantProducts = t("productsPage.products.implants") as unknown as Array<{name: string, description: string}>
  const prostheticProducts = t("productsPage.products.prosthetics") as unknown as Array<{name: string, description: string}>
  
  const categories: CategoryDisplay[] = [
    {
      id: "implan",
      titleKey: "productsPage.categories.implants",
      subtitleKey: "productsPage.categories.implantsSubtitle",
      descriptionKey: "productsPage.categories.implantsDesc",
      icon: Bone,
      products: implantProducts.map((product, index) => ({
        ...product,
        image: [
          "http://ontiyus.com/wp-content/uploads/2020/08/1.-Dynamics-Compression-Plate-4-mm-narrow.png",
          "http://ontiyus.com/wp-content/uploads/2020/07/2.-Dynamics-Compression-Plate-5-mm-narrow.png",
          "http://ontiyus.com/wp-content/uploads/2020/07/4.-Dynamics-Compression-Plate-5-mm-broad.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/5.-Dynamic-Compression-Plate-2-mm-small.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/6.-Simple-plate-4-mm.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/7.-Simple-plate-5-mm.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/8.-L-Buttress-Plate-3-mm-left.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/9.-L-Buttress-Plate-3-mm-Right.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/10.-T-Plate-3-mm.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/11.-Distal-Tibia-Plate-3-mm.png",
          "http://ontiyus.com/wp-content/uploads/2020/08/12.-Reconstruction-Plate-3-mm.png",
        ][index],
        tags: ["hospital", "orthopedic"],
      })),
    },
    {
      id: "prostetik",
      titleKey: "productsPage.categories.prosthetics",
      subtitleKey: "productsPage.categories.prostheticsSubtitle",
      descriptionKey: "productsPage.categories.prostheticsDesc",
      icon: Bone,
      products: prostheticProducts.map((product, index) => ({
        ...product,
        image: [
          "http://ontiyus.com/wp-content/uploads/2022/10/1655261214101-removebg-preview-e1665112051597.png",
          "http://ontiyus.com/wp-content/uploads/2022/10/WhatsApp_Image_2022-07-11_at_10.39.56-removebg-preview-e1665112334968.png",
          "http://ontiyus.com/wp-content/uploads/2022/10/WhatsApp_Image_2022-06-15_at_09.29.59-removebg-preview.png",
          "http://ontiyus.com/wp-content/uploads/2022/10/kaki-191x300.png",
        ][index],
        tags: index === 2 ? ["rehab", "custom"] : ["rehab"],
      })),
    },
  ]

  // Gabungkan produk API dengan produk fallback (produk lama tetap ada)
  const implanFromApi = useMemo(() => apiProducts.filter((p) => (p.category || "").toLowerCase() === "implan"), [apiProducts])
  const prostetikFromApi = useMemo(() => apiProducts.filter((p) => (p.category || "").toLowerCase() === "prostetik"), [apiProducts])
  const lainnyaFromApi = useMemo(() => apiProducts.filter((p) => {
    const cat = (p.category || "").toLowerCase()
    return cat !== "implan" && cat !== "prostetik"
  }), [apiProducts])

  // Produk fallback dengan gambar
  const implanFallback = useMemo(() => implantProducts.map((product, index) => ({
    ...product,
    image: [
      "http://ontiyus.com/wp-content/uploads/2020/08/1.-Dynamics-Compression-Plate-4-mm-narrow.png",
      "http://ontiyus.com/wp-content/uploads/2020/07/2.-Dynamics-Compression-Plate-5-mm-narrow.png",
      "http://ontiyus.com/wp-content/uploads/2020/07/4.-Dynamics-Compression-Plate-5-mm-broad.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/5.-Dynamic-Compression-Plate-2-mm-small.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/6.-Simple-plate-4-mm.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/7.-Simple-plate-5-mm.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/8.-L-Buttress-Plate-3-mm-left.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/9.-L-Buttress-Plate-3-mm-Right.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/10.-T-Plate-3-mm.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/11.-Distal-Tibia-Plate-3-mm.png",
      "http://ontiyus.com/wp-content/uploads/2020/08/12.-Reconstruction-Plate-3-mm.png",
    ][index],
    tags: ["hospital", "orthopedic"],
  })), [implantProducts])

  const prostetikFallback = useMemo(() => prostheticProducts.map((product, index) => ({
    ...product,
    image: [
      "http://ontiyus.com/wp-content/uploads/2022/10/1655261214101-removebg-preview-e1665112051597.png",
      "http://ontiyus.com/wp-content/uploads/2022/10/WhatsApp_Image_2022-07-11_at_10.39.56-removebg-preview-e1665112334968.png",
      "http://ontiyus.com/wp-content/uploads/2022/10/WhatsApp_Image_2022-06-15_at_09.29.59-removebg-preview.png",
      "http://ontiyus.com/wp-content/uploads/2022/10/kaki-191x300.png",
    ][index],
    tags: index === 2 ? ["rehab", "custom"] : ["rehab"],
  })), [prostheticProducts])

  const categorizedApi: CategoryDisplay[] = useMemo(() => [
    {
      id: "implan",
      titleKey: "productsPage.categories.implants",
      subtitleKey: "productsPage.categories.implantsSubtitle",
      descriptionKey: "productsPage.categories.implantsDesc",
      icon: Bone,
      products: [
        ...implanFromApi,
        ...implanFallback,
      ],
    },
    {
      id: "prostetik",
      titleKey: "productsPage.categories.prosthetics",
      subtitleKey: "productsPage.categories.prostheticsSubtitle",
      descriptionKey: "productsPage.categories.prostheticsDesc",
      icon: Bone,
      products: [
        ...prostetikFromApi,
        ...prostetikFallback,
      ],
    },
    {
      id: "lainnya",
      title: "Produk Lainnya",
      subtitle: "Produk tanpa kategori",
      description: "Produk yang belum dikategorikan",
      icon: Bone,
      products: lainnyaFromApi,
    },
  ].filter((c) => c.products.length > 0), [implanFromApi, implanFallback, prostetikFromApi, prostetikFallback, lainnyaFromApi])
  
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t("productsPage.hero.title")}
              <span className="block text-lg lg:text-xl font-normal text-muted-foreground mt-2">{t("productsPage.hero.subtitle")}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("productsPage.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-12 lg:py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="space-y-16 lg:space-y-24">
            {categorizedApi.map((category, index) => (
              <div key={category.id} id={category.id} className="scroll-mt-24">
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <category.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                      {category.title || (category.titleKey ? t(category.titleKey) : "")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.subtitle || (category.subtitleKey ? t(category.subtitleKey) : "")}
                    </p>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                      {category.description || (category.descriptionKey ? t(category.descriptionKey) : "")}
                    </p>
                  </div>
                </div>

                {/* Product Grid - Updated to show real product images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.products.map((product, productIndex) => (
                    <Card key={productIndex} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="w-full h-40 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-4 flex items-center justify-center overflow-hidden border border-border">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="object-contain max-h-36 w-auto" />
                          ) : (
                            <div className="text-center">
                              <div className="text-5xl mb-2">📦</div>
                              <p className="text-sm text-gray-500">Product Image</p>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{product.description}</CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {(product.tags || []).map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {t(`productsPage.tags.${tag}`) || tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {index < categorizedApi.length - 1 && <div className="mt-16 border-b border-border" />}
              </div>
            ))}

            {loaded && apiProducts.length === 0 && !fetchError && (
              <p className="text-sm text-muted-foreground">Tidak ada produk dari API.</p>
            )}
          </div>
          {fetchError && (
            <p className="text-sm text-red-500">{fetchError}</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">{t("cta.needMoreInfo")}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t("cta.needMoreInfoDesc")}
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition-colors"
          >
            {t("cta.contactSales")}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
