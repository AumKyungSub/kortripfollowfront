import React from 'react'

// Kakao Map API Import
import { Map, MapMarker,useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './Explain.style.css'

const Explain = ({rankingData}) => {

    // Kakao Map Script Load
    useKakaoLoader()
    
    // rankingData.latLng가 "lat,lng" 문자열일 경우 숫자로 변환
    const [lat, lng] = rankingData?.latLng.split(',').map(Number);
    const kakaoMapLink = `https://map.kakao.com/link/to/${rankingData?.placeID}`;
  return (
    <div>
      <div className='explainCover'>
        <div className="explainTextCover">
          <h1 className="explainTitle">{rankingData?.explainTitle}</h1>
          <p className="explain">{rankingData?.explain}</p>
          <p className="explainLast">{rankingData?.explainLast}</p>
        </div>
        <Map
            id="map"
            className='topMap'
            center={{ lat: lat, lng: lng }}
            level={3} // 지도 확대 레벨
        >
            <MapMarker position={{ lat: lat, lng: lng }} />
        <div className="topaLinkCover">
            <a href={kakaoMapLink} target="_blank" rel="noopener noreferrer" className='topA'>
                <p>길찾기</p>
            </a>
        </div>
        </Map>
      </div>
    </div>
  )
}

export default Explain
