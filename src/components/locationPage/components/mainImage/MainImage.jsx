import React, {useEffect, useState} from 'react'

// Components
import HomeIcon from '../../../functionComponents/HomeIcon'

// Page css
import './MainImage.style.css'

const MainImage = ({rankingData}) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 479);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1023);
      
  // 화면 크기 변경 시 모바일 여부 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1023);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
      
  // 화면 크기 변경 시 모바일 여부 감지
  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth <= 1023);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div>
      <div className='mainImageCover'>
        {isTablet && <HomeIcon />}
        <div>
          <img src={isMobile?rankingData?.imgName+"2M.jpg"
            :isTablet?rankingData?.imgName+"2T.jpg"
            :rankingData?.imgName+"2.jpg"
          } alt={rankingData?.imgName+"2.jpg"} className='mainImage' />
        </div>
        <div className='mainImageTextCover'>
          <div>
            <h2 className="locationName">{rankingData?.location}</h2>
            <p className="locationSlogan">{rankingData?.imgText}</p>
          </div>
          {rankingData?.review?
              <a href={rankingData?.reviewAddress} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                <span className='review'>찐리뷰</span>
              </a>
            : <div></div>
          }
        </div>
      </div>
      <div className="emptyLine"></div>
    </div>
  )
}

export default MainImage
