import React, {useState,useEffect} from 'react'

// Page css
import './SeasonBanner.style.css'

const SeasonBanner = ({seasonCategory}) => {
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
                <img src={seasonCategory?.img+"1.jpg"} alt={seasonCategory?.img+"1.jpg"} />
                : <img src={seasonCategory?.img+"2.jpg"} alt={seasonCategory?.img+"2.jpg"} />
              }
            </div>
            <div className="seasonBannerText">
                <h3 className="seasonBannerH3">{seasonCategory?.textTitle}</h3>
                <p className="seasonBannerP">{seasonCategory?.text}</p>
            </div>
        </div>
    </div>
        
  )
}

export default SeasonBanner
