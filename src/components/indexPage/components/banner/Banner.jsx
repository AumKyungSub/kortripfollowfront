import React, {useEffect, useState} from 'react'

// Components
import BannerComponent from './BannerComponent';

// Swiper import
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// react-responsive import (hook)
import { useResponsive } from '../../../../hooks/ResponsiveUsed';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page CSS
import './Banner.style.css'


const Banner = ({rankingsData = []}) => {
    
    const {isMobile} = useResponsive();
    // 슬라이드 수 설정
    const slidesView = isMobile ? 1 : 1.584;
    
    const [rankingList, setRankingList] = useState([]);
    
    // 데이터 섞기 (랜덤)
    useEffect(() => {
      // null일 경우 방어용
      if (!Array.isArray(rankingsData) || rankingsData?.length === 0) return;

      const shuffled = [...rankingsData]
        .sort(() => Math.random() - 0.5);
      const topFive = shuffled.slice(0, 5);
  
      setRankingList(topFive);
    }, [rankingsData]);

    // rankingList가 로드될 때만 Swiper 렌더링 (스와이퍼 멈춤 형상 방지)
    if (rankingList?.length === 0) return null;

  return (
    <div>
        <Swiper
            spaceBetween={30}
            slidesPerView={slidesView}
            centeredSlides={true}
            loop={true}
            autoplay={{
                delay: 4500,
                disableOnInteraction: false,
            }}
            pagination={{
                el: ".paging2",
                type: "progressbar",
            }}
            navigation={false}
            modules={[Autoplay, Pagination]}
            className="mySwiper mainBannerSwiper"
        >            
          {rankingList?.map((menu, idx)=>(
            <SwiperSlide className="mainBannerSlide" key={idx}>
                <BannerComponent rankingsDataSlide={menu}/>
            </SwiperSlide>
          ))}
          <div className="play_bar_pc_cover">
            <div className="play_bar_pc">
                <div className="progress_spot_cover">
                    <div className="paging2"></div>
                </div>
            </div>
          </div>
        </Swiper>      
    </div>
    )
}

export default Banner
