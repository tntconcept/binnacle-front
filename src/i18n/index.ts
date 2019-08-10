import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en.json";
import translationEs from "./locales/es.json";

const resources = {
  en: {
    translation: translationEn
  },
  es: {
    translation: translationEs
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    // keySeparator: false,

    interpolation: {
      escapeValue: false
    },

    react: {
      wait: true
    }
  });

export default i18n;
