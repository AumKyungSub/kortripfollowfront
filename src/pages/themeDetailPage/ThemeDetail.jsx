import React, {useState, useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
import { useLocation, useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

// Function Component
import Loading from '@/features/loading/Loading'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import ThemeDetailBanner from '@/pages/themeDetailPage/components/themeDetailBanner/ThemeDetailBanner'
import ThemeDetailCafeInfo from '@/pages/themeDetailPage/components/themeDetailCafeInfo/ThemeDetailCafeInfo'
import ThemeDetailLodging from '@/pages/themeDetailPage/components/themeDetailLodging/ThemeDetailLodging'
import ThemeDetailMap from '@/pages/themeDetailPage/components/themeDetailMap/ThemeDetailMap'
import ThemeDetailLink from '@/pages/themeDetailPage/components/themeDetailLink/ThemeDetailLink'
import ThemeDetailGallery from '@/pages/themeDetailPage/components/themeDetailGallery/ThemeDetailGallery'
import Footer from '@/widgets/footer/Footer'

// Page css
import './ThemeDetail.style.css'

const themeMap = {
    CAFE: { ko: "카페", en: "Cafe" },
    RESTAURANT: { ko: "맛집", en: "Restaurant" },
    LODGING: { ko: "숙소", en: "Lodging" },
    FOOD: { ko: "먹거리", en: "Food" }
};

const ThemeDetail = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    // maxWidth: 479, maxWidth: 767, minWidth: 1024
    const {isMobile, isFullMobile, isDesktop} = useResponsive();
    const { id } = useParams();
    const location = useLocation();
    const { type } = location.state || {};

    // Component에 카페, 식당 넘기기
    const themeCode =
        type === "cafes"
            ? "CAFE"
            : type === "restaurants"
            ? "RESTAURANT"
            : type === "lodgings"
            ? "LODGING"
            : "FOOD";

    // Data 불러오기
    const [data, setData] = useState(null);
    // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
    const [loading, setLoading] = useState(true);
    // 에러 상테 표시 (초기값: null => 에러 없음)
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!type) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = type === "cafes"
                    ? `${import.meta.env.VITE_API_URL}/cafes/${id}`
                    : type === "restaurants"
                    ? `${import.meta.env.VITE_API_URL}/restaurants/${id}`
                    : type === "lodgings"
                    ?`${import.meta.env.VITE_API_URL}/lodgings/${id}`
                    :`${import.meta.env.VITE_API_URL}/foods/${id}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP 에러! 상태: ${res.status}`);
                
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, type]);

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

    const lodgings = type === "lodgings";

    const themeName = themeMap[themeCode][lang];

    return (
        <>
            {!isFullMobile && <Header/>}
            {!isFullMobile && <EmptyHeader/>}
            <ThemeDetailBanner data={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop} lang={lang}/>
            {!isFullMobile ? 
                <div className='themeDetailWholeCover'>
                    <div className="themeDetailLeftWholeCover">
                        {lodgings?
                            <ThemeDetailLodging data={data} isFullMobile={isFullMobile} lang={lang}/>
                        :
                            <ThemeDetailCafeInfo data={data} isFullMobile={isFullMobile} lang={lang} themeName={themeName}/>
                        }
                        <ThemeDetailGallery data={data} isFullMobile={isFullMobile} theme={themeCode}/>
                    </div>
                    <div className="themeDetailRightWholeCover">
                        <ThemeDetailMap data={data} isFullMobile={isFullMobile} lang={lang} />
                        <ThemeDetailLink data={data} isFullMobile={isFullMobile} />
                    </div>
                </div>
            : 
            <div className='themeDetailWholeCover'>
                    <div className="themeDetailLeftWholeCover">
                        <ThemeDetailMap data={data} isFullMobile={isFullMobile} lang={lang}/>
                    </div>
                    <div className="themeDetailRightWholeCover">
                        {lodgings?
                            <ThemeDetailLodging data={data} isFullMobile={isFullMobile} lang={lang}/>
                        :
                            <ThemeDetailCafeInfo data={data} isFullMobile={isFullMobile} lang={lang} themeName={themeName}/>
                        }
                        <ThemeDetailLink data={data} isFullMobile={isFullMobile}/>
                        <ThemeDetailGallery data={data} isFullMobile={isFullMobile} theme={themeCode}/>
                    </div>
                </div>
            }
            <Footer/>
        </>
    )
}

export default ThemeDetail