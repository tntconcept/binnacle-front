import i18nNext from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEn from './en.json'
import translationEs from './es.json'

const resources = {
  en: {
    translation: translationEn
  },
  es: {
    translation: translationEs
  }
}

const shouldRenderKeysInsteadOfValuesForTesting =
  process.env.NODE_ENV === 'test' ? 'cimode' : undefined

i18nNext
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: shouldRenderKeysInsteadOfValuesForTesting,
    interpolation: {
      escapeValue: false
    }
  })

export const i18n = i18nNext
