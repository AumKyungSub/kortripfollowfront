import React from 'react';

// Swiper API
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

///////////////////////////////////////////////
const RecommendComponent = ({ rankingData, isFullMobile}) => {
  if (!rankingData || !rankingData?.img?.gallery || rankingData?.img?.gallery.length === 0) return null;
  
  return (
    <>
    <div className="themeDetailGalleryCover">
      {!isFullMobile ? (
          rankingData?.img?.gallery?.slice(0, 6).map((imgSrc, idx) => (
              <img key={idx} src={rankingData?.img?.link+imgSrc+".jpg"} alt={rankingData?.location?.name} className='galleryPcImg'/>
          ))
      )
      :(
        <Swiper
          key={`mobile-${rankingData?.location}`} // 안정적인 key
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={false}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper recommendSwiper"
        >
        {rankingData?.img?.gallery.map((imgSrc, idx) => (
          <SwiperSlide key={idx} className='recoSwiper'>
          <img src={rankingData?.img?.link+imgSrc+".jpg"} alt={rankingData?.location?.name} />
          </SwiperSlide>
        ))}
        </Swiper>
      )}
    </div>
    </>
  );
};
export default RecommendComponent;
