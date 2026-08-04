export const normalizeSupportedLanguage = (language) => {
  const normalizedLanguage =
    typeof language === "string" ? language.toLowerCase() : "";

  // 영어 계열(en, en-US, en-GB 등)은 영어로 처리합니다.
  if (normalizedLanguage.startsWith("en")) {
    return "en";
  }

  // 한국어 및 지원하지 않는 모든 언어는 한국어로 처리합니다.
  return "ko";
};

export const getBrowserLanguage = () => {
  if (typeof navigator === "undefined") {
    return "ko";
  }

  const browserLanguage =
    navigator.languages?.[0] || navigator.language || "ko";

  return normalizeSupportedLanguage(browserLanguage);
};