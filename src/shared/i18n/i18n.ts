import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEn from 'shared/i18n/en.json'
import translationEs from 'shared/i18n/es.json'

const resources = {
  en: {
    translation: translationEn
  },
  es: {
    translation: translationEs
  }
}

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to the react-i18next components.
  // Alternative use the I18nextProvider: https://react.i18next.com/components/i18nextprovider
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    lng: process.env.NODE_ENV === 'test' ? 'cimode' : undefined,
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },

    // special options for react-i18next
    // learn more: https://react.i18next.com/components/i18next-instance
    react: {
      useSuspense: true
    }
  })

export default i18n
