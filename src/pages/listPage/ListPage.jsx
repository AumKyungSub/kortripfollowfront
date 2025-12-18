import React, {useState, useEffect, useMemo} from 'react'
// (hook) Get Navigate State
import { useLocation } from 'react-router-dom';
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive';
// (hook) Transition Language
import { useTranslation } from 'react-i18next';
// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';
// (custom hook) Region List
import { useRegionList } from '@/shared/hooks/useRegionList';
// (custom hook) Theme List
import { useThemeList } from '@/shared/hooks/useThemeList';

import Loading from '@/features/loading/Loading';

// Components
import Header from '@/widgets/header/Header';
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader';
import ListBanner from '@/widgets/listBanner/ListBanner';
import ListCategory from '@/widgets/listCategory/ListCategory';
import ListCount from '@/widgets/listCount/ListCount';
import List from '@/widgets/list/List';
import Bottom from '@/widgets/bottom/Bottom';
import Footer from '@/widgets/footer/Footer';

import './ListPage.style.css'


// 영문 s/es 한국어 이/가 구분
const getThemeNameWithParticle = (themeCode, text, lang) => {
  if (lang === "en") {
    return `${text}s`;
  }

  const particleMap = {
    CAFE: "가",
    RESTAURANT: "이",
    LODGING: "가",
    FOOD: "가",
  };

  return text + (particleMap[themeCode] || "");
};

const ListPage = ({mode}) => {
  // Transition Language
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Device Size
  const { isFullMobile, isDesktop } = useResponsive();

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

    // region -> theme 이동 시 state 초기화
    useEffect(() => {
        if (navigateSelected) {
            window.history.replaceState({}, ""); // state 제거
        }
    }, [navigateSelected]);


    // 필터링 
  const filteredList = useMemo(() => {
    if (isThemeMode) {
      const themeDataMap = {
        CAFE: cafes,
        RESTAURANT: restaurants,
        LODGING: lodgings,
        FOOD: foods,
      };
      return themeDataMap[selected] || [];
    }

    return selected === "ALL"
      ? [...rankings].sort(() => Math.random() - 0.5)
      : filterByRegion(selected).sort(() => Math.random() - 0.5);
  }, [
    isThemeMode,
    selected,
    cafes,
    restaurants,
    lodgings,
    foods,
    rankings,
    filterByRegion,
  ]);

  // 텍스트
  const selectedText = map[selected]?.[lang] || ""; // 안전 처리

  const title =
    isThemeMode
      ? `${t("theme.titleSuffix")} ${selectedText} ${t("theme.list")}`
      : `${selectedText} ${t("regionPage.titleSuffix")}`;

  const countText =
    isThemeMode
      ? t("theme.totalCount", {
          count: filteredList.length,
          themeName: getThemeNameWithParticle(selected, selectedText, lang),
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
      {!isFullMobile && <EmptyHeader />}

      {isDesktop && (
        <ListBanner
          type={mode}
          images={!isThemeMode ? filteredList : null}
        />
      )}

      <ListCategory
        options={categoryOptions}
        selected={selected}
        setSelected={setSelected}
        isFullMobile={isFullMobile}
      />

      <ListCount
        title={title}
        count={countText}
        countM={filteredList.length}
        isFullMobile={isFullMobile}
      />

      <List
        filteredList={filteredList}
        link={isThemeMode ? "themeDetail" : "location"}
        selectedTheme={selected}
      />

      <Bottom
        type = {bottomType}
      />

      <Footer />
    </>
  )
}

export default ListPage