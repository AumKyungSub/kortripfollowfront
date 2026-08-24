import React, { useState, useEffect, useMemo, useCallback } from 'react'

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
import List from '@/widgets/list/List';
import EmptyState from '@/widgets/emptyState/EmptyState';
import Bottom from '@/widgets/bottom/Bottom';
import Footer from '@/widgets/footer/Footer';
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation';
import Pagination from '@/widgets/pagination/Pagination';

import './ListPage.style.css'


const ListPage = ({ mode }) => {
  // Transition Language
  const { lang, t, isEn, isKo } = useLanguage();

  // Device Size
  const { isMobile, isFullMobile, isDesktop } = useResponsive();

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
  const getThemeNameWithParticle = (themeCode, text, lang) => {
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


  // 필터링 
  const filteredList = useMemo(() => {
    const koCollator = new Intl.Collator('ko', { sensitivity: 'base', numeric: true });
    const sortByVisitPriority = (a, b) => {
      const aPriority = a?.source === 'tourApi' ? 1 : 0;
      const bPriority = b?.source === 'tourApi' ? 1 : 0;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return koCollator.compare(
        a?.location?.name?.ko || '',
        b?.location?.name?.ko || '',
      );
    };

    if (isThemeMode) {
      const themeDataMap = {
        CAFE: cafes,
        RESTAURANT: restaurants,
        LODGING: lodgings,
        FOOD: foods,
      };
      return (themeDataMap[selected] || [])
        .filter(item => item.visibility === true)
        .sort(sortByVisitPriority);
    }

    const regionFiltered =
      selected === "ALL"
        ? rankings
        : filterByRegion(selected);

    return regionFiltered
      .filter(item => item.visibility === true)
      .sort(sortByVisitPriority);

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

  // 페이지네이션
  // const ITEMS_PER_PAGE = 8;
  const ITEMS_PER_PAGE = isFullMobile ? 4 : 6;
  
  const {
    currentPage,
    totalPages,
    pagedList,
    handlePageChange,
  } = usePagination(filteredList, ITEMS_PER_PAGE, selected);


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

      {filteredList.length > 0 ? (
        <>
          <ListCount 
            preTitle = {preTitle}
            title = {title}
            countText = {countText}
          />
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
