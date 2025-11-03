import React, {useEffect, useState} from 'react'

// Components
import HomeIcon from '../../../functionComponents/HomeIcon'

// Page css
import './MainImage.style.css'

const MainImage = ({item}) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
      
  // 화면 크기 변경 시 모바일 여부 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1023);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div>
      <div className='mainImageCover'>
        {isMobile && <HomeIcon />}
        <div>
          <img src={item.imgName+"2.jpg"} alt={item.imgName+"2.jpg"} className='mainImage' />
        </div>
        <div className='mainImageTextCover'>
          <div>
            <h2 className="locationName">{item.location}</h2>
            <p className="locationSlogan">{item.imgText}</p>
          </div>
          {item.review?
              <a href={item.reviewAddress} target="_blank" rel="noopener noreferrer" className='reviewCover'>
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
