import React, {useState, useEffect} from 'react'

import { Link } from 'react-router-dom'

const BannerComponent = ({rankingsDataSlide}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1023);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsTablet(window.innerWidth <= 1023);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div>
      <Link to={`/location/${rankingsDataSlide?.id}`}>
        <img src={isMobile?rankingsDataSlide?.img?.link+"3M.jpg"
          :isTablet?rankingsDataSlide?.img?.link+"3T.jpg"
          :rankingsDataSlide?.img?.link+"3.jpg"} 
          alt={rankingsDataSlide?.img?.link+"3.jpg"} 
        />
        <div className="swiper-text01">
            <strong>{rankingsDataSlide?.location?.name} <br/><span>{rankingsDataSlide?.location?.english}</span></strong>
            <p className="swiper-p01">{rankingsDataSlide?.description?.slide}</p>
        </div>
      </Link>
      
    </div>
  )
}

export default BannerComponent