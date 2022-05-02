/**
 * @module i18n
 * @author Raphael Sack
 * @category Misc
 */

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'de-DE',
    detection: {
        order: ['cookie', 'queryString' , 'navigator', 'htmlTag', 'path', 'subdomain']
    },
    interpolation: {
        escapeValue: false
    }
});

i18n.on('languageChanged', (lng: string) => {
    // Set language cookie to de-DE if not exist, fixes an bug where sometimes the language isnt set correctly at the first join
    if (!document.cookie.includes('i18next')) {
        document.cookie = `i18next=de-DE; path=/`;
        i18next.services.languageDetector.cacheUserLanguage("de-DE");
    }else{
        document.cookie = `i18next=${lng}; path=/`;
        i18next.services.languageDetector.cacheUserLanguage(lng);
    }
});

export default i18n