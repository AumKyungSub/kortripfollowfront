import { useTranslation } from "react-i18next";

import { normalizeSupportedLanguage } from "@/shared/config/language.js";

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  // 컴포넌트에서는 항상 "ko" 또는 "en"만 사용합니다.
  const lang = normalizeSupportedLanguage(i18n.language);

  const changeLanguage = (newLanguage) => {
    const nextLanguage = normalizeSupportedLanguage(newLanguage);

    // 현재 열린 페이지에서만 언어를 변경합니다.
    // 저장하지 않으므로 새로고침하면 브라우저 언어를 다시 감지합니다.
    i18n.changeLanguage(nextLanguage);
  };

  return {
    lang,
    t,
    i18n,
    changeLanguage,

    isKo: lang === "ko",
    isEn: lang === "en",
  };
};