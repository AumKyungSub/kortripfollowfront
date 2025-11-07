import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import RecommendComponent from './RecommendComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './Recommend.style.css';

const Recommend = ({rankingData}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (!rankingData) return <div>데이터가 없습니다.</div>;

    const galleryData = isMobile ? rankingData?.gallery : rankingData?.galleryPc;

  return (
    <div className='topRecommendCover'>
      <h1>갤러리</h1>
      {galleryData && galleryData.length > 0 && galleryData[0] !== "" ? (
        <RecommendComponent rankingDataGallery={{ ...rankingData, gallery: galleryData }} />
      ) : (
      <div>갤러리가 비어있습니다..</div>
      )}
    </div>
  );
};

export default Recommend;
