import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ptCommon from '@/locales/pt/common.json'
import enCommon from '@/locales/en/common.json'
import esCommon from '@/locales/es/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { common: ptCommon },
      en: { common: enCommon },
      es: { common: esCommon },
    },
    defaultNS: 'common',
    fallbackLng: 'pt',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'keepsolo-lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
