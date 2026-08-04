import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ko from "./locales/ko/translation.js";
import en from "./locales/en/translation.js";

import { getBrowserLanguage } from "./language.js";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },

    // 접속 또는 새로고침 때마다 브라우저 언어를 감지합니다.
    lng: getBrowserLanguage(),

    // 지원하지 않는 언어 또는 없는 번역 키는 한국어를 사용합니다.
    fallbackLng: "ko",

    supportedLngs: ["ko", "en"],

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;