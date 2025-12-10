import React,{useState, useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'
import { useLocation } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
import EmptyHeader from '../commonComponents/emptyHeader/EmptyHeader'
import ListBanner from '../commonComponents/listBanner/ListBanner'
import ListCategory from '../commonComponents/listCategory/ListCategory'
import ListCount from '../commonComponents/listCount/ListCount'
import List from '../commonComponents/list/List'
import Bottom from '../commonComponents/bottom/Bottom'
import Footer from '../footer/Footer'

// Page css
import './Theme.style.css'

const themeMap = {
    CAFE: { ko: "카페", en: "Cafe" },
    RESTAURANT: { ko: "맛집", en: "Restaurant" },
    LODGING: { ko: "숙소", en: "Lodging" },
    FOOD: { ko: "먹거리", en: "Food" }
};

const Theme = () => {
    // 언어
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const {
        isFullMobile, /*maxWidth: 767*/
        isDesktop /*minWidth: 1024*/
    } = useResponsive();
    
    // Location으로 불러오기
    const location = useLocation();
    const savedTheme = localStorage.getItem("selectedTheme");
    const navigationTheme = location.state?.selectedTheme;

    const rawTheme = navigationTheme || savedTheme || "CAFE";
    const initialTheme = themeMap[rawTheme] ? rawTheme : "CAFE";
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);
    
    useEffect(() => {
        localStorage.setItem("selectedTheme", selectedTheme);
    }, [selectedTheme]);

    useEffect(() => {
        if (navigationTheme) {
            // state는 딱 한 번 쓰고 버림!
            window.history.replaceState({}, "");
        }
    }, [navigationTheme]);
    
    const handleThemeChange = (value) => {
        setSelectedTheme(value);
        localStorage.setItem("selectedTheme", value);
    };

    // Data 불러오기
    const [data, setData] = useState({ dataC: [], dataR: [], dataL: [], dataF: [] });
    // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
    const [loading, setLoading] = useState(true);
    // 에러 상테 표시 (초기값: null => 에러 없음)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const urlC = `${import.meta.env.VITE_API_URL}/cafes`;
            const urlR = `${import.meta.env.VITE_API_URL}/restaurants`;
            const urlL = `${import.meta.env.VITE_API_URL}/lodgings`;
            const urlF = `${import.meta.env.VITE_API_URL}/foods`;

            const responseC = await fetch(urlC);
            const responseR = await fetch(urlR);
            const responseL = await fetch(urlL);
            const responseF = await fetch(urlF);

            const dataC = await responseC.json();
            const dataR = await responseR.json();
            const dataL = await responseL.json();
            const dataF = await responseF.json();

            setData({dataC, dataR, dataL, dataF});
        } catch (err) {
            console.error("데이터 에러", err);
            setError("데이터 불러오기 실패");
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

    // ---------- 필터링 ----------
    const filteredList =
        selectedTheme === "CAFE"
            ? data.dataC
            : selectedTheme === "RESTAURANT"
            ? data.dataR
            : selectedTheme === "LODGING"
            ? data.dataL
            : data.dataF;

    // UI 표현용
    const themeName = themeMap[selectedTheme][lang];

    // 이/가 구분
    const themePost =
        selectedTheme === "CAFE"
            ? (lang === "ko" ? "카페가" : "Cafe")
            : selectedTheme === "RESTAURANT"
            ? (lang === "ko" ? "맛집이" : "Restaurant")
            : selectedTheme === "LODGING"
            ? (lang === "ko" ? "숙소가" : "Lodging")
            : (lang === "ko" ? "먹거리가" : "Food");

    const themeOptions = Object.entries(themeMap).map(([code, label]) => ({
        code,
        label,
    }));
    return (
        <>
            <Header/>
            {!isFullMobile && <EmptyHeader/>}
            {isDesktop && 
                <ListBanner
                    type="theme"
                    themeRange={{ min: 1, max: 2 }} 
                />
            }
            <ListCategory
                options={themeOptions}
                selected={selectedTheme}
                setSelected={handleThemeChange}
                lang={lang}
                useI18n={false}    // theme는 label.en/label.ko 사용
                isFullMobile={isFullMobile}
            />
            <ListCount 
                title={`${t("theme.titleSuffix")} ${themeName} ${t("theme.list")}`} 
                count={t("theme.totalCount", { count: filteredList.length, themeName: themeName+"s", themePost: themePost })} 
                countM={filteredList.length}
                isFullMobile={isFullMobile}
            />
            <List filteredList={filteredList} link="themeDetail" selectedTheme={selectedTheme}/>
            <Bottom 
                title={
                    selectedTheme === "CAFE"
                        ? t("theme.bottomTitle.cafe")
                        : selectedTheme === "RESTAURANT"
                        ? t("theme.bottomTitle.restaurant")
                        : selectedTheme === "LODGING"
                        ? t("theme.bottomTitle.lodging")
                        : t("theme.bottomTitle.food")
                }
                text={
                    selectedTheme === "CAFE"
                        ? t("theme.bottomText.cafe")
                        : selectedTheme === "RESTAURANT"
                        ? t("theme.bottomText.restaurant")
                        : selectedTheme === "LODGING"
                        ? t("theme.bottomText.lodging")
                        : t("theme.bottomText.food")
                }
                leftTitle={
                    t("theme.bottomLeftTitle")
                }
                leftText={
                    selectedTheme === "CAFE"
                        ? t("theme.bottomLeftText.cafe")
                        : selectedTheme === "RESTAURANT"
                        ? t("theme.bottomLeftText.restaurant")
                        : selectedTheme === "LODGING"
                        ? t("theme.bottomLeftText.lodging")
                        : t("theme.bottomLeftText.food")
                }
                rightTitle={
                    selectedTheme === "CAFE"
                        ? t("theme.bottomRightTitle.cafe")
                        : selectedTheme === "RESTAURANT"
                        ? t("theme.bottomRightTitle.restaurant")
                        : selectedTheme === "LODGING"
                        ? t("theme.bottomRightTitle.lodging")
                        : t("theme.bottomRightTitle.food")
                }
                rightText={
                    selectedTheme === "CAFE"
                        ? t("theme.bottomRightText.cafe")
                        : selectedTheme === "RESTAURANT"
                        ? t("theme.bottomRightText.restaurant")
                        : selectedTheme === "LODGING"
                        ? t("theme.bottomRightText.lodging")
                        : t("theme.bottomRightText.food")
                }
                    />
            <Footer/>
        </>
    )
}

export default Theme
