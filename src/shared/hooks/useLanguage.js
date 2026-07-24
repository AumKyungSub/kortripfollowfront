import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
    const { i18n, t} = useTranslation();
    const lang = i18n.language;

    // 새로운 언어 추가
    const isKo = lang?.startsWith('ko'); // 한국어
    const isEn = lang?.startsWith('en'); // 영어

    // 언어 변경 함수
    const changeLanguage = (newLang) => {
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang);
    };

    return {
        lang,
        t,
        i18n,
        changeLanguage,
        isKo,
        isEn
    }

};