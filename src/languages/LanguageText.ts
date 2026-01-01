import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import no from "./no.json";
import en from "./en.json";

const languageStorageKey = "language";
const defaultLanguage = "no";
//Sjekker om man har satt språket i local storage, ellers bruk norsk som default
const savedLanguage = typeof window === "undefined" ? defaultLanguage
    : window.localStorage.getItem(languageStorageKey) || defaultLanguage;

i18n.use(initReactI18next).init({
    resources: {
        no: { translation: no },
        en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18n;
