import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'de-DE',
    lng: 'de-DE',
    debug: true,
    detection: {
        order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain']
    },
    interpolation: {
        escapeValue: false
    }
})

export default i18n