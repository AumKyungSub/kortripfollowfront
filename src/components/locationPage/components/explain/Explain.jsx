import React from 'react'

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './Explain.style.css'

const Explain = ({rankingData, isDesktop, isFullMobile}) => {

    // Kakao Map Script Load
    useKakaoLoader()
    
    // rankingData.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = rankingData?.location?.latLng.split(',').map(Number); // 메인 장소
    const [latP, lngP] = rankingData?.parking?.latLng.split(',').map(Number); // 주차장
    const kakaoMapLink = `https://map.kakao.com/link/to/${rankingData?.location?.name},${lat},${lng}`;

    // 여러마크 표시
    const markerPositions = [
      {
        title: rankingData?.location?.name,
        lat: lat,
        lng: lng
      },
      {
        title: "추천 주차장",
        lat: latP,
        lng: lngP
      }
    ]

  return (
    <div className='explainWholeCover'>
      <div className='explainCover'>
        <h5 className='explainName'>소개</h5>
        <div className="explainTextImgCover">
          <div className="explainImgCover">
            {isDesktop ? 
              <img src={rankingData?.img?.link+"4.jpg"} alt="explainImg" />
              :
              <img src={rankingData?.img?.link+"3.jpg"} alt="explainImg" />
            }
          </div>
          <div className="explainTextCover">
            <h1 className="explainTitle">{rankingData?.description?.title}</h1>
            <p className="explain">{rankingData?.description?.main}</p>
            <p className="explainLast">{rankingData?.description?.last}</p>
          </div>
        </div>
        <h5 className='explainName'>위치 정보</h5>
        <div className="topMapCover">
          <p className='topMapP'>{`${rankingData?.location?.region[1]} ${rankingData?.location?.region[2]}`}</p>
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
              <a href={kakaoMapLink} target="_blank" rel="noopener noreferrer">
                <div className="topaLinkCover">
                  <p className='topA'>길찾기</p>
                </div>
              </a>
          </Map>
        </div>
      </div>
    </div>
  )
}

export default Explain
