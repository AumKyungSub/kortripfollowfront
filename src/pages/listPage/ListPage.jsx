import React, {useState, useEffect} from 'react'
// (hook) Get Navigate State
import { useLocation } from 'react-router-dom';
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive';
// (hook) languages
import { useTranslation } from 'react-i18next';
// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';

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

const themeMap = {
    CAFE: { ko: "카페", en: "Cafe" },
    RESTAURANT: { ko: "맛집", en: "Restaurant" },
    LODGING: { ko: "숙소", en: "Lodging" },
    FOOD: { ko: "먹거리", en: "Food" },
};

const regionMap = {
    ALL: { ko: "전체", en: "All" },
    SEOUL: { ko: "서울", en: "Seoul" },
    GGICN: { ko: "경기/인천", en: "Gyeonggi/Incheon" },
    GANGWON: { ko: "강원", en: "Gangwon" },
    CCDAEJEON: { ko: "충청/대전", en: "Chungcheong" },
    GSBUSANDAEGUULSAN: { ko: "경상/부산/대구/울산", en: "Gyeongsang/Busan" },
    JRGWANGJU: { ko: "전라/광주", en: "Jeolla/Gwangju" },
    JEJU: { ko: "제주", en: "Jeju" },
};

const ListPage = ({mode}) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { isFullMobile, isDesktop } = useResponsive();
    const location = useLocation();

    // -----------------------------
    // 1) 사용해야 할 map 선택
    // -----------------------------
    const map = mode === "theme" ? themeMap : regionMap;
    const defaultKey = mode === "theme" ? "CAFE" : "ALL";

    // -----------------------------
    // 2) localStorage 또는 navigate state 불러오기
    // -----------------------------
    const saved = localStorage.getItem(`filter-${mode}`);
    const navigateSelected =
        mode === "theme"
            ? location.state?.selectedTheme       /*HomeTheme에서 받는값*/
            : location.state?.selectedRegionCode; /*HomeRegion에서 받는 값*/

    const initialKey = navigateSelected || saved || defaultKey;

    const [selected, setSelected] = useState(initialKey);

    // -----------------------------
    // 3) selected 값 검증 (존재하지 않으면 기본값으로 리셋)
    // -----------------------------
    useEffect(() => {
        const validKeys = Object.keys(map);

        if (!validKeys.includes(selected)) {
            setSelected(defaultKey);
            return;
        }

        // selected가 정상일 경우에만 저장
        localStorage.setItem(`filter-${mode}`, selected);
    }, [selected, mode]);

    // region → theme 이동 시 state 초기화용
    useEffect(() => {
        if (navigateSelected) {
            setSelected(navigateSelected);
            window.history.replaceState({}, ""); // state 제거
        }
    }, [navigateSelected]);

    // -----------------------------
    // 4) DB 불러오기
    // -----------------------------
    const { data, loading, error } = useReadDB();
    const { cafes, restaurants, lodgings, foods, rankings } = data;

    if (loading) return <Loading />;
    if (error) return <div>{error}</div>;

    // -----------------------------
    // 5) 필터링
    // -----------------------------
    let filteredList = [];

    if (mode === "theme") { /*Theme 모드*/
        filteredList =
            selected === "CAFE"
                ? cafes
                : selected === "RESTAURANT"
                ? restaurants
                : selected === "LODGING"
                ? lodgings
                : foods;
    } else { /*Region 모드*/
        filteredList =
            selected === "ALL"
                ? [...rankings].sort(() => Math.random() - 0.5)
                : [...rankings]
                    .filter((item) => item?.location?.region?.code === selected)
                    .sort(() => Math.random() - 0.5);
    }

  // -----------------------------
  // 6) 텍스트
  // -----------------------------
  const selectedText = map[selected]?.[lang] || ""; // 안전 처리

  const title =
    mode === "theme"
      ? `${t("theme.titleSuffix")} ${selectedText} ${t("theme.list")}`
      : `${selectedText} ${t("regionPage.titleSuffix")}`;

  const countText =
    mode === "theme"
      ? t("theme.totalCount", {
          count: filteredList.length,
          themeName: selectedText + "s"
        })
      : t("regionPage.totalCount", { count: filteredList.length });

  const categoryOptions = Object.entries(map).map(([code, label]) => ({
    code,
    label
  }));

  // -----------------------------
  // 7) 페이지 렌더링
  // -----------------------------
  return (
    <>
      <Header />
      {!isFullMobile && <EmptyHeader />}

      {isDesktop && (
        <ListBanner
          type={mode}
          images={mode === "region" ? filteredList : null}
        />
      )}

      <ListCategory
        options={categoryOptions}
        selected={selected}
        setSelected={setSelected}
        lang={lang}
        useI18n={false}
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
        link={mode === "theme" ? "themeDetail" : "location"}
        selectedTheme={selected}
      />

      <Bottom
  title={
    mode === "theme"
      ? t(`theme.bottomTitle.${selected.toLowerCase()}`)
      : t("regionPage.bottomTitle")
  }
  text={
    mode === "theme"
      ? t(`theme.bottomText.${selected.toLowerCase()}`)
      : t("regionPage.bottomText")
  }
  leftTitle={
    mode === "theme"
      ? t("theme.bottomLeftTitle")
      : t("regionPage.bottomLeftTitle")
  }
  leftText={
    mode === "theme"
      ? t(`theme.bottomLeftText.${selected.toLowerCase()}`)
      : t("regionPage.bottomLeftPlace")
  }
  rightTitle={
    mode === "theme"
      ? t(`theme.bottomRightTitle.${selected.toLowerCase()}`)
      : t("regionPage.bottomRightTitle")
  }
  rightText={
    mode === "theme"
      ? t(`theme.bottomRightText.${selected.toLowerCase()}`)
      : t("regionPage.bottomRightText")
  }
      />

      <Footer />
    </>
  )
}

export default ListPage