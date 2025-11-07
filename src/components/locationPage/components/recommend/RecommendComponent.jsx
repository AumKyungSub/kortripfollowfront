import React from 'react';

// Swiper API
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

///////////////////////////////////////////////
const RecommendComponent = ({ rankingDataGallery }) => {
  if (!rankingDataGallery || !rankingDataGallery?.gallery || rankingDataGallery?.gallery.length === 0) return null;
  
  return (
    <>
      <Swiper
        key={`mobile-${rankingDataGallery?.location}`} // 안정적인 key
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
      {rankingDataGallery?.gallery.map((imgSrc, idx) => (
        <SwiperSlide key={idx} className='recoSwiper'>
        <img src={rankingDataGallery?.imgName+imgSrc+".jpg"} alt={rankingDataGallery?.location} />
        </SwiperSlide>
      ))}
      </Swiper>

      <div className='galleryPcCover'>
        {rankingDataGallery?.gallery.map((imgSrc, idx) => (
          <div key={idx} className={`galleryPcImgCover img-${idx}`}>
            <img src={rankingDataGallery?.imgName+imgSrc+".jpg"} alt={rankingDataGallery?.location} className='galleryPcImg'/>
          </div>
        ))}
      </div>
    </>
  );
};
export default RecommendComponent;
