import React, {useState,useEffect} from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB';

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
          
  const { data, loading, error } = useReadDB();
  const { rankings } = data;
  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Header />
      {!isFullMobile && <EmptyHeader/>}
      <Banner rankingsData={rankings} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {isFullMobile && <Seasons/>}
      <TopPlaces rankingsData={rankings} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {!isFullMobile && <HomeRegion rankingData={rankings}/>}
      {!isFullMobile && <HomeSeason rankingData={rankings}/>}
      {!isFullMobile && <HomeTheme />}
      <Footer/>
    </div>
  )
}

export default Homepage
