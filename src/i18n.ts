import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "./locales/en/common.json";
import enProducts from "./locales/en/products.json";
import enCheckout from "./locales/en/checkout.json";
import enErrors from "./locales/en/errors.json";
import frCommon from "./locales/fr/common.json";
import frProducts from "./locales/fr/products.json";
import frCheckout from "./locales/fr/checkout.json";
import frErrors from "./locales/fr/errors.json";
import arCommon from "./locales/ar/common.json";
import arProducts from "./locales/ar/products.json";
import arCheckout from "./locales/ar/checkout.json";
import arErrors from "./locales/ar/errors.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, products: enProducts, checkout: enCheckout, errors: enErrors },
    fr: { common: frCommon, products: frProducts, checkout: frCheckout, errors: frErrors },
    ar: { common: arCommon, products: arProducts, checkout: arCheckout, errors: arErrors },
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
