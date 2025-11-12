import React, {useEffect, useState} from 'react'

// Components
import BannerComponent from './BannerComponent';

// Swiper import
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page CSS
import './Banner.style.css'


const Banner = ({rankingsData = [], isMobile, isFullMobile, isDesktop}) => {
    // 슬라이드 수 설정
    const slidesView = isMobile ? 1 : 1.584;
    // 데이터 5개 랜덤으로 부르기
    const [rankingList, setRankingList] = useState([]);
    
    // 데이터 섞기 (랜덤)
    useEffect(() => {
      // null일 경우 방어용
      if (!Array.isArray(rankingsData) || rankingsData?.length === 0) return;

      const topFive = [...rankingsData]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
  
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
                el: ".paging",
                type: "progressbar",
            }}
            navigation={false}
            modules={[Autoplay, Pagination]}
            className="mySwiper mainBannerSwiper"
        >            
          {rankingList?.map((menu)=>(
            <SwiperSlide className="mainBannerSlide" key={menu.id}>
                <BannerComponent 
                  rankingsDataSlide={menu} 
                  isFullMobile={isFullMobile} 
                  isDesktop={isDesktop}
                />
            </SwiperSlide>
          ))}
          <div className="playBarPcCover">
            <div className="playBarPc">
                <div className="progressSpotCover">
                    <div className="paging"></div>
                </div>
            </div>
          </div>
        </Swiper>      
    </div>
    )
}

export default Banner
