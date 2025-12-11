import React, {useState,useEffect} from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

//Function Component
import Loading from '@/features/loading/Loading'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import Banner from '@/pages/homePage/components/banner/Banner'
import TopPlaces from '@/pages/homePage/components/topPlaces/TopPlaces'
import Seasons from '@/pages/homePage/components/seasons/Seasons'
import HomeRegion from '@/pages/homePage/components/homeRegion/HomeRegion'
import HomeSeason from '@/pages/homePage/components/homeSeason/HomeSeason'
import HomeTheme from '@/pages/homePage/components/homeTheme/HomeTheme'
import Footer from '@/widgets/footer/Footer'

//Page Css
import './Homepage.style.css'

const Homepage = () => {
  const {
          isMobile, /*maxWidth: 479*/
          isFullMobile, /*maxWidth: 767*/ 
          isDesktop /*minWidth: 1024*/
        } = useResponsive();
        
  const { t } = useTranslation();
  
  // Data 불러오기
  const [data, setData] = useState([]);
  // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
  const [loading, setLoading] = useState(true);
  // 에러 상테 표시 (초기값: null => 에러 없음)
  const [error, setError] = useState(null);

  // Data 불러오기 처리
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${import.meta.env.VITE_API_URL}/rankings`;
        const response = await fetch(url);
        const db = await response.json();
        setData(db);
      } catch (err) {
        console.error("데이터 에러", err);
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  // 로딩 화면
  if (loading) return <div><Loading/></div>
  // 에러 화면
  if (error) return <div>{error}</div>
  // 데이터 없을때 화면
  if (!data || data.length === 0) return <div>{t("common.noData")}</div>;

  return (
    <div>
      <Header />
      {!isFullMobile && <EmptyHeader/>}
      <Banner rankingsData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {isFullMobile && <Seasons/>}
      <TopPlaces rankingsData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {!isFullMobile && <HomeRegion rankingData={data}/>}
      {!isFullMobile && <HomeSeason rankingData={data}/>}
      {!isFullMobile && <HomeTheme />}
      <Footer/>
    </div>
  )
}

export default Homepage
