import React from 'react';

// Components
import RecommendComponent from './RecommendComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './Recommend.style.css';

const Recommend = ({rankingData, isFullMobile}) => {
    
    if (!rankingData) return <div>데이터가 없습니다.</div>;

    const galleryData = isFullMobile ? rankingData?.img?.gallery : rankingData?.img?.galleryPc;

  return (
    <div className='topRecommendCover'>
      {!isFullMobile && <h5 className='explainName'>갤러리</h5>}
      {!isFullMobile && <div className='emptyLine1px'></div>}
      {galleryData && galleryData.length > 0 && galleryData[0] !== "" ? (
        <RecommendComponent rankingData={rankingData} isFullMobile={isFullMobile} />
      ) : (
      <div>갤러리가 비어있습니다..</div>
      )}
    </div>
  );
};

export default Recommend;
