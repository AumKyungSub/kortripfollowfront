import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

import { useTranslation } from 'react-i18next'

import { useReadOneDB } from '@/shared/api/useReadOneDB'

//Function Component
import Loading from '@/features/loading/Loading'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import Footer from '@/widgets/footer/Footer'
import MainImage from '@/pages/locationPage/components/mainImage/MainImage'
import Explain from '@/pages/locationPage/components/explain/Explain'
import Parking from '@/pages/locationPage/components/parking/Parking'
import LocInfo from '@/pages/locationPage/components/locationInfo/LocInfo'
import LocInfoNotPc from '@/pages/locationPage/components/locationInfo/LocInfoNotPc'
import Recommend from '@/pages/locationPage/components/recommend/Recommend'

// Page CSS
import './Location.style.css'

const Location = () => {
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

    return (
        <div>
            {!isFullMobile && <Header/>}
            {!isFullMobile && <EmptyHeader/>}
            {data && <MainImage rankingData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop} lang={lang}/>}
            {!isFullMobile ?
                <div className='locationDetailWholeCover'>
                    <div className="locationDetailLeftWholeCover">
                        <Explain rankingData={data} isFullMobile={isFullMobile} isDesktop={isDesktop} isTablet={isTablet} lang={lang}/>
                        <Parking rankingData={data}  isFullMobile={isFullMobile} lang={lang}/>
                        <Recommend rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                    </div>
                    <div className="locationDetailRightWholeCover">
                        <LocInfo rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                    </div>
                </div>
            :
                <div>
                    <Explain rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                    <LocInfoNotPc rankingData={data} lang={lang}/>
                    <Parking rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                    <Recommend rankingData={data} isFullMobile={isFullMobile} lang={lang}/>
                </div>
            }
            <Footer/>
        </div>
    )
}

export default Location
