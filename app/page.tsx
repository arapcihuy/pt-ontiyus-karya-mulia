"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { PartnersSection } from "@/components/partners-section"
import { GallerySection } from "@/components/gallery-section"
import { NewsSection } from "@/components/news-section"
import { BooksSection } from "@/components/books-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <GallerySection />
      <PartnersSection />
      <BooksSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
