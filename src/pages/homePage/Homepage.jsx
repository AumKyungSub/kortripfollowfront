import React from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// (hook) Transition Language
import { useTranslation } from 'react-i18next'

// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';

//Function Component
import Loading from '@/features/loading/Loading'
import FailedData from '@/features/failedData/FailedData';

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
  // Device Size
  const {
          isMobile, /*maxWidth: 479*/
          isFullMobile, /*maxWidth: 767*/ 
          isDesktop /*minWidth: 1024*/
  } = useResponsive();

  // Transition Language
  const { i18n } = useTranslation();
  const lang = i18n.language;
  
  // Read DB
  const { data, loading, error, refetch } = useReadDB();
  const { rankings } = data;
  if (loading) return <Loading />;
  if (error) return <FailedData onRetry={refetch} />;

  return (
    <div>
      <Header />
      {!isFullMobile && <EmptyHeader/>}
      <Banner rankingsData={rankings} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop} lang={lang}/>
      {isFullMobile && <Seasons/>}
      <TopPlaces rankingsData={rankings} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {!isFullMobile && <HomeRegion rankingData={rankings} lang={lang}/>}
      {!isFullMobile && <HomeSeason rankingData={rankings}/>}
      {!isFullMobile && <HomeTheme />}
      <Footer/>
    </div>
  )
}

export default Homepage
