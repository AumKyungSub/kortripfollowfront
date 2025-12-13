const themeMap = {
  CAFE: { ko: "카페", en: "Cafe" },
  RESTAURANT: { ko: "맛집", en: "Restaurant" },
  LODGING: { ko: "숙소", en: "Lodging" },
  FOOD: { ko: "먹거리", en: "Food" },
};

const themeCode = {
  cafes: "CAFE",
  restaurants: "RESTAURANT",
  lodgings: "LODGING",
  foods: "FOOD",
};

export const useThemeList = () => {
  const getThemeCode = (type) => themeCode[type];

  const getThemeName = (themeCode, lang = "ko") =>
    themeMap[themeCode]?.[lang] ?? "";

  return {
    themeMap,
    getThemeCode,
    getThemeName,
  };
};