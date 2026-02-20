import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

import { useTranslation } from 'react-i18next'

import { useReadOneDB } from '@/shared/api/useReadOneDB'

//Function Component
import Loading from '@/features/loading/Loading'
import FailedData from '@/features/failedData/FailedData'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter'
import Footer from '@/widgets/footer/Footer'
import DetailBanner from '@/widgets/detailBanner/DetailBanner'
import LocationDetailExplain from '@/pages/locationDetailPage/components/locationDetailExplain/LocationDetailExplain'
import Parking from '@/pages/locationPage/components/parking/Parking'
import LocInfo from '@/pages/locationPage/components/locationInfo/LocInfo'
import DetailLink from '@/widgets/detailLink/DetailLink'
import DetailReview from '@/widgets/detailReview/DetailReview'
import DetailGallery from '@/widgets/detailGallery/DetailGallery'
import DetailVideo from '@/widgets/detailVideo/DetailVideo'

// Page css
import './LocationDetailPage.style.css'

const LocationDetailPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    // minWidth: 1024
    const {isMobile, isTablet, isFullMobile, isDesktop} = useResponsive();
    
    const { data, loading, error } = useReadOneDB("rankings", id);

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>{t("common.noData")}</div>;

    // 4. Draft / 비공개 데이터 차단
    if (data.visibility === false) {
      return <FailedData />;
    }

  return (
          <div>
              {!isFullMobile && <Header/>}
              {!isFullMobile && <EmptyHeader/>}
              {data && <DetailBanner 
                name={data.location?.name?.[lang]}
                address={
                    lang === "ko"
                        ? data.location?.address?.ko?.[0]
                        : data.location?.address?.en?.[1]
                }
                slogan={data.description?.short?.[lang]}
                imgLink={data.img?.link}
                isFullMobile={isFullMobile}
                isDesktop={isDesktop}
                />}
              {!isFullMobile ?
                  <div className='locationDetailWholeCover'>
                      <div className="locationDetailLeftWholeCover">
                          <LocationDetailExplain rankingData={data} isFullMobile={isFullMobile} isDesktop={isDesktop} isTablet={isTablet} lang={lang}/>
                          <Parking rankingData={data}  isFullMobile={isFullMobile} lang={lang}/>
                      <DetailGallery data={data} isFullMobile={isFullMobile} lang={lang}/>
                      </div>
                      <div className="locationDetailRightWholeCover">
                          <LocInfo rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                          <DetailLink data={data} isFullMobile={isFullMobile} />
                          <DetailReview data={data} isFullMobile={isFullMobile} />
                          <DetailVideo video={data.video} isFullMobile={isFullMobile} />
                      </div>
                  </div>
              :
                  <div>
                      <LocationDetailExplain rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                      <LocInfo rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                      <DetailLink data={data} isFullMobile={isFullMobile} />
                      <DetailReview data={data} isFullMobile={isFullMobile} />
                      <Parking rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                      <DetailVideo video={data.video} isFullMobile={isFullMobile} />
                      <DetailGallery data={data} isFullMobile={isFullMobile} lang={lang}/>
                  </div>
              }
              {isFullMobile && <EmptyFooter/>}
              <Footer/>
          </div>
  )
}

export default LocationDetailPage