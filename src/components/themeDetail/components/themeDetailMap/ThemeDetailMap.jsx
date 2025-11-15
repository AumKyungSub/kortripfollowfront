import React from 'react'

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk'

// Page css
import './ThemeDetailMap.style.css'

const ThemeDetailMap = ({data, isFullMobile}) => {
    // Kakao Map Script Load
    useKakaoLoader()
    
    // data.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = data?.location?.latLng.split(',').map(Number); // 메인 장소
    const kakaoMapLink = `https://map.kakao.com/link/to/${data?.location?.name},${lat},${lng}`;

    const goToMenu = () => {
        window.open(kakaoMapLink, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="themeDetailMapWholeCover">
                <h1 className='themeDetailMapH1'>위치</h1>
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
                        {`${data?.location?.region[1]} ${data?.location?.region[2]}`}
                    </p>
                </div>
                <button className='topBtnTheme' onClick={goToMenu}>
                    <img src="/images/kakaomap.png" alt="kakao" />
                    길찾기
                </button>
            </section>
        </>
    )
}

export default ThemeDetailMap
