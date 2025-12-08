import React from 'react'

import { useTranslation } from 'react-i18next';

// Swiper API
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

// Page css
import './ThemeDetailGallery.style.css'

const ThemeDetailGallery = ({data, isFullMobile, theme}) => {
    const {t} = useTranslation();
    return (
        <>
            {isFullMobile && <div className='emptyLine'></div>}
            <section className="themeDetailGalleryWholeCover">
                <h1 className='themeDetailGalleryH1'>{t("locationPage.recommend.title")}</h1>
                {!isFullMobile && <div className='emptyLine1px'></div>}
                <div className="themeDetailGalleryCover">
                    {!isFullMobile ? (
                        data?.img?.gallery?.slice(0, 6).map((item, idx) => (
                            <img key={idx} src={`${data?.img?.link}${item}.jpg`} alt={`${data?.img?.link}${item}.jpg`} />
                        ))
                    )
                    :(
                        <Swiper
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
                            {data?.img?.gallery?.map((item, idx) => (
                                <SwiperSlide key={idx} className='recoSwiper'>
                                    <img
                                        src={`${data?.img?.link}${item}.jpg`}
                                        alt={`${data?.img?.link}${item}.jpg`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) 
                    }
                </div>
            </section>
        </>
    )
}

export default ThemeDetailGallery
