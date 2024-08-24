import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import namespaces from './namespaces.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
        react: {
            useSuspense: false,
        },
        fallbackLng: "en",
        lng: "ru",

        ns: namespaces,
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        interpolation: {
            escapeValue: false
        }
});

export default i18n;