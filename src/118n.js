// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 번역 JSON 가져오기
import ko from "./locales/ko/translation.json";
import en from "./locales/en/translation.json";

const savedLang = localStorage.getItem("lang"); // 이전에 선택한 언어 기억용

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ko: { translation: ko },
            en: { translation: en }
        },
        lng: savedLang || "ko",           // 기본 언어
        fallbackLng: "ko",                // 번역 키 없을 때 기본 언어
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
