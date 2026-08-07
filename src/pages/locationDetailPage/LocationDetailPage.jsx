import React from 'react'
/*------------------------API hooks-----------------------------------*/
// Read One DB
import { useReadOneDB } from '@/shared/api/useReadOneDB'
/*------------------------/API hooks-----------------------------------*/

/*------------------------hooks-----------------------------------*/
// Params
import { useParams } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/



//Function Component
import Loading from '@/features/loading/Loading'
import FailedData from '@/features/failedData/FailedData'

// Components
import Header from '@/widgets/header/Header'
import Footer from '@/widgets/footer/Footer'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter'
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation'
import DetailBanner from '@/widgets/detailBanner/DetailBanner'
import LocationDetailExplain from '@/pages/locationDetailPage/components/locationDetailExplain/LocationDetailExplain'
import DetailMap from '@/widgets/detailMap/DetailMap'
import LocationDetailInformation from '@/pages/locationDetailPage/components/locationDetailInformation/LocationDetailInformation'
import LocationDetailFees from '@/pages/locationDetailPage/components/locationDetailFees/LocationDetailFees'
import DetailLink from '@/widgets/detailLink/DetailLink'
import DetailReview from '@/widgets/detailReview/DetailReview'
import DetailGallery from '@/widgets/detailGallery/DetailGallery'
import DetailVideo from '@/widgets/detailVideo/DetailVideo'

// Page css
import './LocationDetailPage.style.css'

const LocationDetailPage = () => {
    const { id } = useParams();
    const { t, lang} = useLanguage();
    // minWidth: 1024
    const {isFullMobile} = useResponsive();
    
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
            <Header/>
            <DetailBanner 
                data={data}
                />
            {!isFullMobile 
            ?
            <>
                <div className='locationDetailWholeCover'>
                    <div className="locationDetailLeftWholeCover">
                        <LocationDetailExplain rankingData={data} />
                        <DetailLink data={data} isFullMobile={isFullMobile} />
                        <DetailVideo
                            video={data.video}
                            data={data}
                            variant="feature"
                        />
                        <DetailReview data={data} typeTable="rankings" isFullMobile={isFullMobile} />
                    </div>
                    <div className="locationDetailRightWholeCover">
                        <DetailMap 
                            data={data}
                            showParkingInfo={true}
                        />
                        <LocationDetailInformation rankingData={data}/>
                        <LocationDetailFees rankingData={data}/>
                    </div>
                </div>
                        <DetailGallery data={data} isFullMobile={isFullMobile} lang={lang}/>
                        </>
            :
                <div>
                    <LocationDetailExplain rankingData={data}/>
                    <DetailMap 
                        data={data}
                        showParkingInfo={true}
                    />
                    <LocationDetailInformation rankingData={data}/>
                    <LocationDetailFees rankingData={data}/>
                    <DetailLink data={data} isFullMobile={isFullMobile} />
                    <DetailVideo
                        video={data.video}
                        data={data}
                        isFullMobile={isFullMobile}
                        variant="feature"
                    />
                    <DetailReview data={data} typeTable="rankings" isFullMobile={isFullMobile} />
                    <DetailGallery data={data} isFullMobile={isFullMobile} lang={lang}/>
                </div>
            }
            <Footer/>
            {isFullMobile && <EmptyFooter/>}
            {isFullMobile && <MobileNavigation/>}
        </div>
    )
}

export default LocationDetailPage
