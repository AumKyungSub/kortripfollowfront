import { useMemo, useCallback } from "react";
import { useLanguage } from "@/shared/hooks/useLanguage";

export const useRegionList = ({ data = []}) => {
  
  const { lang, isEn } = useLanguage();
  const currentLang = isEn ? "en" : "ko";

    const regionMap = {
        ALL: { 
            ko: "대한민국", 
            en: "Republic of Korea" 
        },
        SEOUL: { 
            ko: "서울", 
            en: "Seoul" 
        },
        GGICN: { 
            ko: "경기도 / 인천", 
            en: "Gyeonggi / Incheon" 
        },
        GANGWON: { 
            ko: "강원특별자치도", 
            en: "Gangwon" 
        },
        CCDAEJEON: { 
            ko: "충청도", 
            en: "Chungcheong" 
        },
        GSBUSANDAEGUULSAN: {
            ko: "경상도",
            en: "Gyeongsang",
        },
        JRGWANGJU: { 
            ko: "전라도", 
            en: "Jeolla" 
        },
        JEJU: { 
            ko: "제주도", 
            en: "Jeju Island" 
        },
    };

  /* ---------------- 지역 옵션 (UI용) ---------------- */
  const regionOptions = useMemo(
    () =>
      Object.entries(regionMap).map(([code, labels]) => ({
        code,
        // labels["ko-KR"] 방지 -> currentLang("ko" 또는 "en") 사용 및 fallback
        label: labels[currentLang] || labels.en || labels.ko,
      })),
    [regionMap, currentLang]
  );

  /* ---------------- 지역별 카운트 ---------------- */
  const regionCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      const code = item?.location?.region?.code;
      if (!code) return acc;
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  /* ---------------- 필터 ---------------- */
  const filterByRegion = useCallback(
    (code) => {
      if (code === "ALL") return data;
      return data.filter(
        (item) => item?.location?.region?.code === code
      );
    },
    [data]
  );

  return {
    regionMap,
    regionOptions,
    regionCounts,
    filterByRegion,
  };
};
