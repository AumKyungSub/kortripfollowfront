import { useMemo, useCallback } from "react";

export const useRegionList = ({ data = [], lang = "ko" }) => {
    const regionMap = {
        ALL: { 
            ko: "전체", 
            en: "All" 
        },
        SEOUL: { 
            ko: "서울", 
            en: "Seoul" 
        },
        GGICN: { 
            ko: "경기/인천", 
            en: "Gyeonggi/Incheon" 
        },
        GANGWON: { 
            ko: "강원", 
            en: "Gangwon" 
        },
        CCDAEJEON: { 
            ko: "충청/대전", 
            en: "Chungcheong" 
        },
        GSBUSANDAEGUULSAN: {
            ko: "경상/부산/대구/울산",
            en: "Gyeongsang/Busan",
        },
        JRGWANGJU: { 
            ko: "전라/광주", 
            en: "Jeolla/Gwangju" 
        },
        JEJU: { 
            ko: "제주", 
            en: "Jeju" 
        },
    };

  /* ---------------- 지역 옵션 (UI용) ---------------- */
  const regionOptions = useMemo(
    () =>
      Object.entries(regionMap).map(([code, labels]) => ({
        code,
        label: labels[lang],
      })),
    [lang]
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
