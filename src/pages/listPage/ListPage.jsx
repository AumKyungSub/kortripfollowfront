import React, { useState, useEffect, useMemo } from 'react'

/*------------------------API hooks-----------------------------------*/
// Read DB
import { useReadDB } from '@/shared/api/useReadDB';
/*------------------------/API hooks-----------------------------------*/

/*------------------------hooks-----------------------------------*/
// Location
import { useLocation } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
// Theme List
import { useThemeList } from '@/shared/hooks/useThemeList';
// Region List
import { useRegionList } from '@/shared/hooks/useRegionList';
// Pagination
import { usePagination } from '@/shared/hooks/usePagination';
/*------------------------/custom hooks-----------------------------------*/

import Loading from '@/features/loading/Loading';

// Components
import Header from '@/widgets/header/Header';
import ListBanner from '@/widgets/listBanner/ListBanner';
import ListCategory from '@/widgets/listCategory/ListCategory';
import ListCount from '@/widgets/listCount/ListCount';
import ThemeRegionFilter from '@/widgets/themeRegionFilter/ThemeRegionFilter';
import List from '@/widgets/list/List';
import EmptyState from '@/widgets/emptyState/EmptyState';
import Bottom from '@/widgets/bottom/Bottom';
import Footer from '@/widgets/footer/Footer';
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation';
import Pagination from '@/widgets/pagination/Pagination';

import './ListPage.style.css'

const DISTRICT_ALL = "__ALL_DISTRICTS__";
const REGION_ALL = "__ALL_REGIONS__";

const getDistrict = (item) => {
  const koreanAddress = item?.address1 || item?.location?.address?.ko;
  const koreanText = Array.isArray(koreanAddress)
    ? koreanAddress.join(" ")
    : koreanAddress || "";
  const koreanTokens = koreanText
    .replace(/[(),]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const koreanName =
    koreanTokens.slice(1).find((token) => /(?:시|군|구)$/.test(token)) ||
    koreanTokens.find((token) => /(?:시|군|구)$/.test(token));

  if (!koreanName) return null;

  const englishAddress = item?.addressEn || item?.location?.address?.en;
  const englishText = Array.isArray(englishAddress)
    ? englishAddress.join(", ")
    : englishAddress || "";
  const englishName = englishText.match(/[A-Za-z][A-Za-z'’.-]*-(?:si|gun|gu)\b/i)?.[0];

  return {
    code: koreanName,
    ko: koreanName,
    en: englishName || koreanName,
  };
};


const ListPage = ({ mode }) => {
  // Transition Language
  const { lang, t, isEn } = useLanguage();

  // Device Size
  const { isFullMobile } = useResponsive();

  // Get Navigate State
  const location = useLocation();

  // DB 불러오기
  const { data, loading, error } = useReadDB();
  const { cafes, restaurants, lodgings, foods, rankings } = data;

  // Theme List
  const { themeMap } = useThemeList();

  // Region List
  const {
    regionMap,
    filterByRegion,
  } = useRegionList({
    data: rankings,
    lang,
  });

  // 영문 s/es 한국어 이/가 구분
  const getThemeNameWithParticle = (text) => {
    if (isEn) {
      return `${text}s`;
    }  
    return text;
  };

  // mode === theme 변수 담기
  const isThemeMode = mode === "theme";
  // map mode로 각Map 선택
  const map = isThemeMode ? themeMap : regionMap;
  // 디폴트 키 선택 (category 가장 처음으로 설정)
  const defaultKey = isThemeMode ? "CAFE" : "ALL";

  // localStorage 또는 navigate state 불러오기
  const navigateSelected =
    isThemeMode
      ? location?.state?.selectedTheme       /* HomeTheme에서 받는값 */
      : location?.state?.selectedRegionCode; /* HomeRegion에서 받는 값 */

  const saved = sessionStorage.getItem(`filter-${mode}`);

  const initialSelected = navigateSelected || saved || defaultKey;

  const [selected, setSelected] = useState(initialSelected);
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_ALL);
  const [selectedThemeRegion, setSelectedThemeRegion] = useState(REGION_ALL);
  const [selectedThemeDistrict, setSelectedThemeDistrict] = useState(DISTRICT_ALL);

  const themeDataMap = useMemo(() => ({
    CAFE: cafes,
    RESTAURANT: restaurants,
    LODGING: lodgings,
    FOOD: foods,
  }), [cafes, restaurants, lodgings, foods]);

  const themeBaseList = useMemo(
    () => isThemeMode ? (themeDataMap[selected] || []) : [],
    [isThemeMode, themeDataMap, selected]
  );

  const themeRegionOptions = useMemo(() => {
    if (!isThemeMode) return [];
    const regionCodes = new Set(
      themeBaseList
        .filter((item) => item.visibility === true)
        .map((item) => item?.location?.region?.code || item?.regionCode)
        .filter(Boolean)
    );

    return [
      { code: REGION_ALL, label: isEn ? "All" : "전체" },
      ...Object.entries(regionMap)
        .filter(([code]) => code !== "ALL" && regionCodes.has(code))
        .map(([code, labels]) => ({
          code,
          label: labels?.[lang] || labels?.[isEn ? "en" : "ko"] || code,
        })),
    ];
  }, [isThemeMode, themeBaseList, regionMap, lang, isEn]);

  const themeRegionList = useMemo(() => {
    if (selectedThemeRegion === REGION_ALL) return themeBaseList;
    return themeBaseList.filter(
      (item) => (item?.location?.region?.code || item?.regionCode) === selectedThemeRegion
    );
  }, [themeBaseList, selectedThemeRegion]);

  const themeDistrictOptions = useMemo(() => {
    if (!isThemeMode || selectedThemeRegion === REGION_ALL) return [];
    const districts = new Map();
    themeRegionList
      .filter((item) => item.visibility === true)
      .forEach((item) => {
        const district = getDistrict(item);
        if (district && !districts.has(district.code)) {
          districts.set(district.code, district);
        }
      });

    const collator = new Intl.Collator(isEn ? "en" : "ko", {
      sensitivity: "base",
      numeric: true,
    });

    return [
      { code: DISTRICT_ALL, label: isEn ? "All" : "전체" },
      ...Array.from(districts.values())
        .sort((a, b) => collator.compare(a[isEn ? "en" : "ko"], b[isEn ? "en" : "ko"]))
        .map((district) => ({
          code: district.code,
          label: district[isEn ? "en" : "ko"],
        })),
    ];
  }, [isThemeMode, selectedThemeRegion, themeRegionList, isEn]);

  const regionBaseList = useMemo(() => {
    if (isThemeMode) return [];
    return selected === "ALL" ? rankings : filterByRegion(selected);
  }, [isThemeMode, selected, rankings, filterByRegion]);

  const districtOptions = useMemo(() => {
    if (isThemeMode || selected === "ALL") return [];

    const districts = new Map();
    regionBaseList
      .filter((item) => item.visibility === true)
      .forEach((item) => {
        const district = getDistrict(item);
        if (district && !districts.has(district.code)) {
          districts.set(district.code, district);
        }
      });

    const collator = new Intl.Collator(isEn ? 'en' : 'ko', {
      sensitivity: 'base',
      numeric: true,
    });
    const options = Array.from(districts.values())
      .sort((a, b) => collator.compare(a[isEn ? 'en' : 'ko'], b[isEn ? 'en' : 'ko']))
      .map((district) => ({
        code: district.code,
        label: district[isEn ? 'en' : 'ko'],
      }));

    return [
      { code: DISTRICT_ALL, label: isEn ? "All" : "전체" },
      ...options,
    ];
  }, [isThemeMode, selected, regionBaseList, isEn]);


  // 필터링 
  const filteredList = useMemo(() => {
    const koCollator = new Intl.Collator('ko', { sensitivity: 'base', numeric: true });
    const sortByVisitPriority = (a, b) => {
      const aPriority = ['tourApi', 'manual'].includes(a?.source) ? 1 : 0;
      const bPriority = ['tourApi', 'manual'].includes(b?.source) ? 1 : 0;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return koCollator.compare(
        a?.location?.name?.ko || '',
        b?.location?.name?.ko || '',
      );
    };

    if (isThemeMode) {
      const themeFiltered = selectedThemeDistrict === DISTRICT_ALL
        ? themeRegionList
        : themeRegionList.filter(
          (item) => getDistrict(item)?.code === selectedThemeDistrict
        );
      return themeFiltered
        .filter(item => item.visibility === true)
        .sort(sortByVisitPriority);
    }

    const regionFiltered = selectedDistrict === DISTRICT_ALL
      ? regionBaseList
      : regionBaseList.filter(
        (item) => getDistrict(item)?.code === selectedDistrict
      );

    return regionFiltered
      .filter(item => item.visibility === true)
      .sort(sortByVisitPriority);

  }, [
    isThemeMode,
    themeRegionList,
    selectedThemeDistrict,
    regionBaseList,
    selectedDistrict,
  ]);

  // 페이지네이션
  // const ITEMS_PER_PAGE = 8;
  const ITEMS_PER_PAGE = isFullMobile ? 4 : 6;
  
  const {
    currentPage,
    totalPages,
    pagedList,
    handlePageChange,
  } = usePagination(
    filteredList,
    ITEMS_PER_PAGE,
    `${selected}:${selectedDistrict}:${selectedThemeRegion}:${selectedThemeDistrict}`
  );


  // Bottom Type 결정 
  const bottomType = isThemeMode ? selected : "ALL";

  // selected 값 검증 (존재하지 않으면 기본값으로 리셋)
  useEffect(() => {
    if (!Object.keys(map).includes(selected)) {
      setSelected(defaultKey);
      return;
    }

    // selected가 정상일 경우에만 저장
    sessionStorage.setItem(`filter-${mode}`, selected);
  }, [selected, map, mode, defaultKey]);

  useEffect(() => {
    setSelectedDistrict(DISTRICT_ALL);
    setSelectedThemeRegion(REGION_ALL);
    setSelectedThemeDistrict(DISTRICT_ALL);
  }, [selected, mode]);

  useEffect(() => {
    if (
      selectedDistrict !== DISTRICT_ALL &&
      !districtOptions.some((option) => option.code === selectedDistrict)
    ) {
      setSelectedDistrict(DISTRICT_ALL);
    }
  }, [districtOptions, selectedDistrict]);

  useEffect(() => {
    if (
      selectedThemeRegion !== REGION_ALL &&
      !themeRegionOptions.some((option) => option.code === selectedThemeRegion)
    ) {
      setSelectedThemeRegion(REGION_ALL);
      setSelectedThemeDistrict(DISTRICT_ALL);
    }
  }, [themeRegionOptions, selectedThemeRegion]);

  useEffect(() => {
    if (
      selectedThemeDistrict !== DISTRICT_ALL &&
      !themeDistrictOptions.some((option) => option.code === selectedThemeDistrict)
    ) {
      setSelectedThemeDistrict(DISTRICT_ALL);
    }
  }, [themeDistrictOptions, selectedThemeDistrict]);

  // region -> theme 이동 시 state 초기화
  useEffect(() => {
    if (navigateSelected) {
      window.history.replaceState({}, ""); // state 제거
    }
  }, [navigateSelected]);

  // 텍스트
  const selectedText = map[selected]?.[lang] || ""; // 안전 처리

  const title =
    isThemeMode
      ? `${selectedText}`
      : lang.startsWith("ko")
        ? `${selectedText}`
        : `${selectedText}`;

  const preTitle = isThemeMode ? "RECOMMENDED" : "DESTINATIONS IN";

  const count = filteredList.length;

  const countText =
    isThemeMode
      ? t("theme.totalCount", {
        count: filteredList.length,
        themeName: getThemeNameWithParticle(selectedText),
      })
      : t("regionPage.totalCount", { count: filteredList.length });

  const categoryOptions = Object.entries(map).map(([code, label]) => ({
    code,
    label: label?.[lang] ?? ""
  }));

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <ListBanner
        title={title}
        count={count}
        type={mode}
        selected = {selected}
        images={!isThemeMode ? filteredList : null}
      />

      <ListCategory
        options={categoryOptions}
        selected={selected}
        setSelected={setSelected}
        isFullMobile={isFullMobile}
      />

      {!isThemeMode && selected !== "ALL" && districtOptions.length > 1 && (
        <ListCategory
          options={districtOptions}
          selected={selectedDistrict}
          setSelected={setSelectedDistrict}
          isFullMobile={isFullMobile}
          isSecondary
        />
      )}

      {filteredList.length > 0 ? (
        <>
          <ListCount 
            preTitle = {preTitle}
            title = {title}
            countText = {countText}
          >
            {isThemeMode && (
              <ThemeRegionFilter
                regionOptions={themeRegionOptions}
                districtOptions={themeDistrictOptions}
                selectedRegion={selectedThemeRegion}
                selectedDistrict={selectedThemeDistrict}
                onRegionChange={(regionCode) => {
                  setSelectedThemeRegion(regionCode);
                  setSelectedThemeDistrict(DISTRICT_ALL);
                }}
                onDistrictChange={setSelectedThemeDistrict}
                onReset={() => {
                  setSelectedThemeRegion(REGION_ALL);
                  setSelectedThemeDistrict(DISTRICT_ALL);
                }}
                resultCount={filteredList.length}
                isEn={isEn}
              />
            )}
          </ListCount>
          <List
            filteredList={pagedList}
            link={isThemeMode ? "theme" : "location"}
            selectedTheme={selected}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          onButtonClick={isThemeMode ? () => setSelected(defaultKey) : () => setSelected("ALL")}
        />
      )}

      <Bottom
        type={bottomType}
      />
      <Footer />
      {isFullMobile && <EmptyFooter />}
      {isFullMobile && <MobileNavigation />}
    </>
  )
}

export default ListPage
