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
        <img src={isMobile?rankingsDataSlide?.imgName+"3M.jpg"
          :isTablet?rankingsDataSlide?.imgName+"3T.jpg"
          :rankingsDataSlide?.imgName+"3.jpg"} 
          alt={rankingsDataSlide?.imgName+"3.jpg"} 
        />
        <div className="swiper-text01">
            <strong>{rankingsDataSlide?.location} <br/><span>{rankingsDataSlide?.locationEnglish}</span></strong>
            <p className="swiper-p01">{rankingsDataSlide?.explainSide}</p>
        </div>
      </Link>
      
    </div>
  )
}

export default BannerComponent