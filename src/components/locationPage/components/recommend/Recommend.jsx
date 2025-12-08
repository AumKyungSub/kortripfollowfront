import React from 'react';

import { useTranslation } from 'react-i18next';

// Components
import RecommendComponent from './RecommendComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './Recommend.style.css';

const Recommend = ({rankingData, isFullMobile}) => {

    const {t} = useTranslation();
    
    if (!rankingData) return <div>데이터가 없습니다.</div>;

    const galleryData = isFullMobile ? rankingData?.img?.gallery : rankingData?.img?.galleryPc;

  return (
    <div className='topRecommendCover'>
      {!isFullMobile && <h5 className='explainName'>{t("locationPage.recommend.title")}</h5>}
      {!isFullMobile && <div className='emptyLine1px'></div>}
      {galleryData && galleryData.length > 0 && galleryData[0] !== "" ? (
        <RecommendComponent rankingData={rankingData} isFullMobile={isFullMobile} />
      ) : (
      <div>{t("locationPage.recommend.empty")}</div>
      )}
    </div>
  );
};

export default Recommend;
