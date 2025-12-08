import React from 'react'

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'

import { useTranslation } from 'react-i18next'

// Page css
import './ThemeDetailMap.style.css'

const ThemeDetailMap = ({data, isFullMobile, lang}) => {
    const {t} = useTranslation();
    // Kakao Map Script Load
    useKakaoLoader()
    
    // data.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = data?.location?.latLng.split(',').map(Number); // 메인 장소
    const kakaoMapLink = `https://map.kakao.com/link/to/${data?.location?.name?.[lang]},${lat},${lng}`;

    const goToMenu = () => {
        window.open(kakaoMapLink, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="themeDetailMapWholeCover">
                <h1 className='themeDetailMapH1'>{t("themeDetail.tDM.tDMLocation")}</h1>
                {!isFullMobile && <div className='emptyLine1px'></div>}
                <Map
                    id="map"
                    className='topMapTheme'
                    center={{ lat: lat, lng: lng }}
                    level={3} // 지도 확대 레벨
                >
                    <MapMarker position={{ lat: lat, lng: lng }} />
                </Map>
                <div className="topAThemeLinkCover">
                    <p className='topATheme'>
                        <img src="/images/icon/regionIcon.png" alt="region" />
                        {data?.location?.address?.[lang].join(" ")}
                    </p>
                </div>
                <button className='topBtnTheme' onClick={goToMenu}>
                    <img src="/images/kakaomap.png" alt="kakao" />
                    {t("themeDetail.tDM.tDMDirections")}
                </button>
            </section>
        </>
    )
}

export default ThemeDetailMap
