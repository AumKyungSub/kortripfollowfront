import React, {useState, useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
import { useLocation, useParams } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import { useReadOneDB } from '@/shared/api/useReadOneDB'

import { useThemeList } from '@/shared/hooks/useThemeList'

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

const ThemeDetail = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    // maxWidth: 479, maxWidth: 767, minWidth: 1024
    const {isMobile, isFullMobile, isDesktop} = useResponsive();
    const { id } = useParams();
    const location = useLocation();
    const { type } = location.state || {};

    
  const { getThemeCode, getThemeName } = useThemeList();
  const themeCode = getThemeCode(type);
  const themeName = getThemeName(themeCode, lang);

    const { data, loading, error } = useReadOneDB(type, id);

  const isLodging = themeCode === 'LODGING';

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>{t("common.noData")}</div>;



    return (
        <>
            {!isFullMobile && <Header/>}
            {!isFullMobile && <EmptyHeader/>}
            <ThemeDetailBanner data={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop} lang={lang}/>
            {!isFullMobile ? 
                <div className='themeDetailWholeCover'>
                    <div className="themeDetailLeftWholeCover">
                        {isLodging?
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
                        {isLodging?
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