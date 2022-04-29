import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'de-DE',
    debug: true,
    detection: {
        order: ['cookie', 'queryString' , 'navigator', 'htmlTag', 'path', 'subdomain']
    },
    interpolation: {
        escapeValue: false
    }
});

i18n.on('languageChanged', (lng: string) => {
    document.cookie = `i18next=${lng}; path=/`;
    if (i18next.services.languageDetector) {
        console.log('languageChanged', lng);
        i18next.services.languageDetector.cacheUserLanguage(lng);
    }
});

export default i18n