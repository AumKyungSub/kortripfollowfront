import React from 'react'

// Kakao Map API Import
import { Map, MapMarker,useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './Explain.style.css'

const Explain = ({rankingData}) => {

    // Kakao Map Script Load
    useKakaoLoader()
    
    // rankingData.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = rankingData?.location?.latLng.split(',').map(Number);
    const kakaoMapLink = `https://map.kakao.com/link/to/${rankingData?.location?.placeID}`;
  return (
    <div className='explainWholeCover'>
      <div className='explainCover'>
        <div className="explainTextCover">
          <h1 className="explainTitle">{rankingData?.description?.title}</h1>
          <p className="explain">{rankingData?.description?.main}</p>
          <p className="explainLast">{rankingData?.description?.last}</p>
        </div>
        <div className="topMapCover">
          <p className='topMapP'>{`${rankingData?.location?.region[1]} ${rankingData?.location?.region[2]}`}</p>
          <Map
              id="map"
              className='topMap'
              center={{ lat: lat, lng: lng }}
              level={3} // 지도 확대 레벨
              >
              <MapMarker position={{ lat: lat, lng: lng }} />
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
