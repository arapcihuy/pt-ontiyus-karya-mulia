'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '@/lib/translations/en.json'
import id from '@/lib/translations/id.json'

type Language = 'en' | 'id'
type Translations = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  translations: Translations
}

const translationsMap: Record<Language, Translations> = {
  en,
  id,
}

// Create default t function for server-side
const createTranslator = (language: Language = 'id') => {
  const translations = translationsMap[language]
  return (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }
}

// Default context value
const defaultContext: LanguageContextType = {
  language: 'id',
  setLanguage: () => {},
  t: createTranslator('id'),
  translations: translationsMap['id'],
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get language from localStorage or browser
    const saved = localStorage.getItem('language') as Language | null
    const browser = navigator.language.startsWith('en') ? 'en' : 'id'
    setLanguageState(saved || browser)
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const translations = translationsMap[language]

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}
