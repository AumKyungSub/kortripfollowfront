import React from 'react';
// (hook) Device Size
import { useResponsive } from '../../../../hooks/ResponsiveUsed';

// Components
import RecommendComponent from './RecommendComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './Recommend.style.css';

const Recommend = ({rankingData}) => {
  // maxWidth: 767
    const {isFullMobile} = useResponsive();
    
    if (!rankingData) return <div>데이터가 없습니다.</div>;

    const galleryData = isFullMobile ? rankingData?.img?.gallery : rankingData?.img?.galleryPc;

  return (
    <div className='topRecommendCover'>
      <h1>갤러리</h1>
      {galleryData && galleryData.length > 0 && galleryData[0] !== "" ? (
        <RecommendComponent rankingData={rankingData} isMobile={isFullMobile} />
      ) : (
      <div>갤러리가 비어있습니다..</div>
      )}
    </div>
  );
};

export default Recommend;
