import React from 'react'

/*------------------------API hooks-----------------------------------*/
// Read DB
import { useReadDB } from '@/shared/api/useReadDB';
/*------------------------/API hooks-----------------------------------*/

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
/*------------------------/custom hooks-----------------------------------*/

//Function Component
import Loading from '@/features/loading/Loading'
import FailedData from '@/features/failedData/FailedData';

// Components
import Header from '@/widgets/header/Header'
import HomeBanner from '@/pages/homePage/components/homeBanner/HomeBanner';
import HomePlannerGuide from '@/pages/homePage/components/homePlannerGuide/HomePlannerGuide';
import HomeReview from '@/pages/homePage/components/homeReview/HomeReview';
import HomeCategory from '@/pages/homePage/components/homeCategory/HomeCategory';
import HomeRegion from '@/pages/homePage/components/homeRegion/HomeRegion'
import HomeSeason from '@/pages/homePage/components/homeSeason/HomeSeason'
import HomeTheme from '@/pages/homePage/components/homeTheme/HomeTheme'
import HomeCollection from '@/pages/homePage/components/homeCollection/HomeCollection'
import Footer from '@/widgets/footer/Footer'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter';
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation';

//Page Css
import './Homepage.style.css'

const Homepage = () => {
  // Device Size
  const {
    isFullMobile, /*maxWidth: 767*/
  } = useResponsive();

  // Read DB
  const { data, loading, error, refetch } = useReadDB();
  const { blogs, rankings, cafes, restaurants} = data;
  if (loading) return <Loading />;
  if (error) return <FailedData onRetry={refetch} />;

  return (
    <div>
      <Header />
      {/* 1. Slide */}
      <HomeBanner 
        rankingsData={rankings}
      />
      {/* 2. Trip Planner Guide */}
      <HomePlannerGuide />
      {/* 2. Category (Only '~ 767px') */}
      {isFullMobile && <HomeCategory />}
      {/* 3. Blog Review */}
      <HomeReview 
        rankingsData={rankings} 
        blogsData={blogs} 
        cafesData={cafes} 
        restaurantsData={restaurants} 
      />
      {/* 4. By Regions */}
      <HomeRegion 
        rankingData={rankings} 
      />
      {/* 5. By Seasons (Only '768px ~') */}
      {/* 나중에 데이터 정리되면 재 오픈 */}
      {/* {!isFullMobile && <HomeSeason rankingData={rankings} />} */}
      {/* 6. By Themes */}
      <HomeTheme />
      {/* 7. Collections */}
      <HomeCollection />
      {/* 8. Footer */}
      <Footer />
      {/* 9. Mobile Navigation (Only '~ 767px') */}
      {isFullMobile && <EmptyFooter />}
      {isFullMobile && <MobileNavigation />}
    </div>
  )
}

export default Homepage
