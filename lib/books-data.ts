import idTranslations from "./translations/id.json"
import enTranslations from "./translations/en.json"

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publisher: string
  year: number
  pageCount: number
  dimensions: string
  description: string
  price: number
  image: string
  availability: boolean
}

// Base book data (language-independent)
const baseBooks = [
  {
    id: "1",
    author: "Dr. Ir. Suyitno",
    isbn: "978-623-6084-80-9",
    publisher: "Penerbit Teknik Universitas Gadjah Mada",
    year: 2023,
    pageCount: 456,
    dimensions: "21 x 29.7 cm",
    price: 125000,
    image: "/books/logam-ferro.webp",
    availability: true,
  },
  {
    id: "2",
    author: "Dr. Ir. Suyitno",
    isbn: "978-623-6084-81-6",
    publisher: "Penerbit Teknik Universitas Gadjah Mada",
    year: 2023,
    pageCount: 512,
    dimensions: "21 x 29.7 cm",
    price: 135000,
    image: "/books/logam-non-ferro.webp",
    availability: true,
  },
  {
    id: "3",
    author: "Dr. Ir. Suyitno",
    isbn: "978-623-6084-82-3",
    publisher: "Penerbit Teknik Universitas Gadjah Mada",
    year: 2023,
    pageCount: 480,
    dimensions: "21 x 29.7 cm",
    price: 145000,
    image: "/books/polimer-keramik.webp",
    availability: true,
  },
]

// Function to get books with translations
export function getBooks(language: "id" | "en" = "id"): Book[] {
  const translations = language === "id" ? idTranslations : enTranslations
  const bookTranslations = translations.books.items

  return baseBooks.map((book, index) => ({
    ...book,
    title: bookTranslations[index]?.title || "",
    description: bookTranslations[index]?.description || "",
  }))
}

// Default export for backward compatibility (Indonesian)
export const books: Book[] = getBooks("id")
