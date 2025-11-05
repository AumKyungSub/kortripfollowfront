import React, {useState,useEffect} from 'react'

// Page css
import './SeasonBanner.style.css'

const SeasonBanner = ({item}) => {
  const [isMobil, setIsMobil] = useState(window.innerWidth <= 479);
          
  // 화면 크기 변경 시 모바일 여부 감지
  useEffect(() => {
      const handleResize = () => setIsMobil(window.innerWidth <= 479);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='seasonBannerWholeCover'>
        <div className='seasonBannerCover'>
            <div className="seasonBannerImg">
              {isMobil?
                <img src={item?.img+"1.jpg"} alt={item?.img+"1.jpg"} />
                : <img src={item?.img+"2.jpg"} alt={item?.img+"2.jpg"} />
              }
            </div>
            <div className="seasonBannerText">
                <h3 className="seasonBannerH3">{item?.textTitle}</h3>
                <p className="seasonBannerP">{item?.text}</p>
            </div>
        </div>
    </div>
        
  )
}

export default SeasonBanner
