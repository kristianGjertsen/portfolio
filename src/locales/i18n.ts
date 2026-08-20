import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import noAbout from "./no/about.json";
import noContact from "./no/contact.json";
import noCv from "./no/cv.json";
import noFooter from "./no/footer.json";
import noHeader from "./no/header.json";
import noHome from "./no/home.json";
import noProjects from "./no/projects.json";
import noSeo from "./no/seo.json";
import enAbout from "./en/about.json";
import enContact from "./en/contact.json";
import enCv from "./en/cv.json";
import enFooter from "./en/footer.json";
import enHeader from "./en/header.json";
import enHome from "./en/home.json";
import enProjects from "./en/projects.json";
import enSeo from "./en/seo.json";

const languageStorageKey = "language";
const defaultLanguage = "no";
const savedLanguage =
  typeof window === "undefined"
    ? defaultLanguage
    : window.localStorage.getItem(languageStorageKey) || defaultLanguage;

i18n.use(initReactI18next).init({
  resources: {
    no: {
      about: noAbout,
      contact: noContact,
      cv: noCv,
      footer: noFooter,
      header: noHeader,
      home: noHome,
      projects: noProjects,
      seo: noSeo,
    },
    en: {
      about: enAbout,
      contact: enContact,
      cv: enCv,
      footer: enFooter,
      header: enHeader,
      home: enHome,
      projects: enProjects,
      seo: enSeo,
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  supportedLngs: ["no", "en"],
  defaultNS: "home",
  interpolation: { escapeValue: false },
});

export default i18n;
