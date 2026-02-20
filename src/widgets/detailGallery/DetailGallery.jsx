import React from 'react'

import { useTranslation } from 'react-i18next';

// Swiper API
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

//Page css
import './DetailGallery.style.css'

const DetailGallery = ({data, isFullMobile}) => {
    const {t} = useTranslation();
    return (
            <>
                <section className="detailGalleryWrap">
                    {!isFullMobile ? 
                        <>
                            <h4 className='detailTitleMin768'>{t("locationPage.recommend.title")}</h4>
                            <div className='emptyLine1px'></div>
                        </>
                    :
                        <>
                            <h6 className='detailTitleMax768'>{t("locationPage.recommend.title")}</h6>
                        </>
                    }
                    <div className="detailGalleryCover">
                        {!isFullMobile ? 
                        (
                            data?.img?.gallery?.slice(0, 6).map((item, idx) => (
                                <img key={idx} src={`${data?.img?.link}${item}.jpg`} alt={`${data?.img?.link}${item}.jpg`} />
                            ))
                        )
                        :
                        (
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

export default DetailGallery