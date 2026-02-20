import React from 'react'

import { useTranslation } from 'react-i18next';

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './Parking.style.css'

const Parking = ({rankingData, isFullMobile, lang}) => {
    const { t } = useTranslation();

    // Kakao Map Script Load
    useKakaoLoader()
    
    // rankingData.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = rankingData?.location?.latLng.split(',').map(Number); // 메인 장소
    const [latP, lngP] = rankingData?.parking?.latLng.split(',').map(Number); // 주차장
    const kakaoMapLinks = `https://map.kakao.com/link/to/${rankingData?.location?.name?.[lang]},${lat},${lng}`;
    const kakaoMapLink = `https://map.kakao.com/link/to/${rankingData?.location?.name?.[lang]} ${t("locationPage.parking.parkingArea")},${latP},${lngP}`;

    // 여러마크 표시
    const markerPositions = [
      {
        title: rankingData?.location?.name?.[lang],
        lat: lat,
        lng: lng
      },
      {
        title: t("locationPage.parking.markerRecommend"),
        lat: latP,
        lng: lngP
      }
    ]

const addressArr = rankingData?.location?.address?.[lang] || [];

const separator = lang.startsWith('ko') ? ' ' : ', ';
    
  const fullAddress = addressArr.filter(Boolean).join(separator);

  return (
    <>
    <div className='topParkingWholeCover'>
      {!isFullMobile && 
        <>
          <h4 className='detailTitleMin768'>{t("locationPage.parking.title")}</h4>
          <div className="emptyLine1px"></div>
        </>
      }
      <div className="topMapCover">
        <Map
            id="map"
            className='topMap'
            center={{ lat: ((lat+latP)/2), lng: ((lng+lngP)/2) }}
            level={rankingData?.parking?.level}
            //테스트용
            // level={4}
            >
          {markerPositions.map((pos, index) => (
            <React.Fragment key={index}>
              <MapMarker position={{ lat: pos.lat, lng: pos.lng }} />
              
              {/* ✅ 마커 위에 텍스트 추가 */}
              <CustomOverlayMap position={{ lat: pos.lat, lng: pos.lng }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pos.title}
                </div>
              </CustomOverlayMap>
            </React.Fragment>
          ))}
            <p className='topMapP'>
              <img src="/images/icon/regionIcon.png" alt="regionIcon" />
              {fullAddress}
            </p>
        </Map>
      </div>
      <div className="topParkingInfo">
          <img src="/images/icon/parkingsIcon.png" alt="parkingsIcon" />
          <p className='parkT'>
            {rankingData?.parking?.existence
              ? `${rankingData?.parking?.fee ? t("locationPage.parking.paid") 
              : t("locationPage.parking.free")} ${t("locationPage.parking.parkingAvailable")}`
              : t("locationPage.parking.parkingNotAvailable")}
          </p>
      </div>
      <div className="navigationCover">
        <a href={kakaoMapLinks} target="_blank" rel="noopener noreferrer" className='navigationBtnCover'>
          <button className="navigationBtn">
            <img src="/images/icon/mapIcon.png" alt="mapIcon" />
            <p className='navigationP'>{t("locationPage.parking.navigation")}</p>
          </button>
        </a>
        <a href={kakaoMapLink} target="_blank" rel="noopener noreferrer" className='navigationBtnCover'>
          <button className="navigationBtn">
            <img src="/images/icon/mapIcon.png" alt="mapIcon" />
            <p className='navigationP'>{t("locationPage.parking.recommendParking")}</p>
          </button>
        </a>
      </div>
    </div>
    {isFullMobile && <div className="emptyLine"></div>}
    </>
  )
}

export default Parking
