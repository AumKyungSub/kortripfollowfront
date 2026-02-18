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
import HomeBanner from '@/pages/homePage/components/homeBanner/HomeBanner';
import HomeRecommended from '@/pages/homePage/components/homeRecommended/HomeRecommended';
import HomeCategory from '@/pages/homePage/components/homeCategory/HomeCategory';
import HomeRegion from '@/pages/homePage/components/homeRegion/HomeRegion'
import HomeSeason from '@/pages/homePage/components/homeSeason/HomeSeason'
import HomeTheme from '@/pages/homePage/components/homeTheme/HomeTheme'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
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
      <HomeBanner rankingsData={rankings} isFullMobile={isFullMobile} isDesktop={isDesktop} lang={lang}/>
      {isFullMobile && <HomeCategory/>}
      <HomeRecommended rankingsData={rankings} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      <HomeRegion rankingData={rankings} lang={lang} isFullMobile={isFullMobile}/>
      {!isFullMobile && <HomeSeason rankingData={rankings}/>}
      <HomeTheme isFullMobile={isFullMobile}/>
      {isFullMobile && <EmptyFooter/>}
      <Footer/>
    </div>
  )
}

export default Homepage
