import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './SeasonList.style.css'

const SeasonList = ({bannerList, list, lang}) => {

    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
    // console.log("dd",list)

    // 화면 크기 변경 감지
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 480);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <>
        <div className='seasonListCover'>
            <div className="seasonListText">
                {bannerList.map((item) => (
                    <h3 key={item.id} className="seasonListH3">
                        {item?.textTitleSecond?.[lang]}
                    </h3>
                ))}
            </div>
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={30}
                className="mySwiper seasonListSwiper"
            >
                {list.map((item)=>(
                    <SwiperSlide key={item.id} className='seasonSwiper' onClick={()=> navigate(`/location/${item.id}`)}>
                        <div className="seasonListImg">
                            <img src={isMobile ? item?.img?.link+"4.jpg" : item?.img?.link+"3.jpg"} alt={item?.img?.link+"1.jpg"}/>
                        </div>
                        <div className="seasonListText">
                            <h4 className="seasonListH4">{item?.location?.name?.[lang]}</h4>
                            <p className="seasonListP">{item?.description?.title?.[lang]}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </>
  )
}

export default SeasonList
