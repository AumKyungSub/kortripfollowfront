import React from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Components
import ShareBtn from '@/widgets/shareBtn/ShareBtn';
import FavoriteButton from '@/features/favoriteButton/FavoriteButton';
import PlaceRating from '@/features/placeRating/PlaceRating';

// Page css
import './DetailBanner.style.css'

const DetailBanner = ({
    data,
    subName,
    placeType,
}) => {

    const {lang, t} = useLanguage();

    /*
        베너 이미지 불러오기
        화면 비율별 사진 따로
    */
    const imgLink = `${data?.img?.link}2.jpg`;
    /* 디바이스 별 이미지 따로 작업하게 되면 사용
    const bgi = isDesktop
        ? `${imgLink}2.jpg`
        : isFullMobile
        ? `${imgLink}2.jpg`
        : `${imgLink}2.jpg`*/

    /* 
        언어별 주소 데이터 가져오기
        언어 추가시 addressByLanguage에 한줄씩 추가
    */
    const addressByLanguage = {
        ko: data?.location?.address?.ko?.[0],
        en: data?.location?.address?.en?.[1]
    }
    const address = addressByLanguage[lang] ?? addressByLanguage.ko;
    
    const fullAddress = data?.location?.address?.[lang];

    const slogan = data.description?.short?.[lang];

    const name = data.location?.name?.[lang];

    /*
        길찾기 지도 링크 연결
    */
    const latLng = data?.location?.latLng; 

    if (!latLng) return null

    const [lat, lng] = latLng.split(',').map(Number) 

    /*
        각 언어별 지도 주소
    */
    const englishName = data?.location?.name?.en;
    const englishAddress =
        data?.location?.address?.en?.[1] ??
        data?.location?.address?.en?.[0];
    const googleMapQuery = [englishName, englishAddress]
        .filter(Boolean)
        .join(', ');
    const mapLinkByLanguage = {
        ko:`https://map.kakao.com/link/to/${name},${lat},${lng}`,
        en: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapQuery)}`
    }  
    const mapLink = mapLinkByLanguage[lang] ?? mapLinkByLanguage.ko;
        
    return (
        <section
            className='detailBannerWrapper'
            style={{ backgroundImage: `url(${imgLink})` }}
        >
            

            <div className='detailBannerTextCover'>
                {address && (
                    <div className="detailBannerTopCover">
                        <p className="detailBannerTextAddress">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fafaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                            {address}
                        </p>
                        <p className="detailBannerTextAddress">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fafaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                            {t('detailPage.common.banner.visit')}
                        </p>
                    </div>
                )}
                <div className="detailBannerTitleRow">
                    <h1 className="detailBannerTextName">
                        {name}
                        {subName && ` ${subName}`}
                    </h1>
                    <PlaceRating summary={data.ratingSummary} variant="banner" />
                </div>

                {address && (
                    <p className="detailBannerTextFullAddress">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                        {fullAddress}
                    </p>
                )} 

                <div className="detailBannerLinkCover">
                    {placeType && data?.id && (
                        <FavoriteButton placeType={placeType} placeId={data.id} />
                    )}
                    <a 
                        href={mapLink} 
                        className="detailBannerLinkMap" 
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fafaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>
                        {t('detailPage.common.banner.navigate')}
                    </a>
                    <ShareBtn title={subName ? `${name} ${subName}` : name} text={slogan} variant="default"/>
                </div>
            </div>
        </section>
    )
}   

export default DetailBanner
