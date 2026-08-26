const themeMap = {
  CAFE: { ko: "카페", en: "Cafe" },
  RESTAURANT: { ko: "맛집", en: "Restaurant" },
  LODGING: { ko: "숙소", en: "Lodging" },
  FOOD: { ko: "먹거리", en: "Food" },
  MARKET: { ko: "시장", en: "Market" },
  PARK: { ko: "공원", en: "Park" },
  OCEAN: { ko: "해수욕장", en: "Beach" },
  DRIVE: { ko: "드라이브", en: "Drive" },
};

const themeCode = {
  CAFE: "CAFE",
  RESTAURANT: "RESTAURANT",
  LODGING: "LODGING",
  FOOD: "FOOD",
  MARKET: "MARKET",
  PARK: "PARK",
  OCEAN: "OCEAN",
  DRIVE: "DRIVE",
  cafe: "CAFE",
  restaurant: "RESTAURANT",
  lodging: "LODGING",
  food: "FOOD",
  market: "MARKET",
  park: "PARK",
  ocean: "OCEAN",
  drive: "DRIVE",
  cafes: "CAFE",
  restaurants: "RESTAURANT",
  lodgings: "LODGING",
  foods: "FOOD",
  markets: "MARKET",
  parks: "PARK",
  oceans: "OCEAN",
  drives: "DRIVE",
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
