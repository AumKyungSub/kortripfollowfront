import React, {useState,useEffect} from 'react'

// Page css
import './SeasonBanner.style.css'

const SeasonBanner = ({seasonCategory, lang}) => {
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
                <img src={seasonCategory?.img+"2.jpg"} alt={seasonCategory?.img+"2.jpg"} />
            </div>
            <div className="seasonBannerText">
                <h3 className="seasonBannerH3">{seasonCategory?.textTitle?.[lang]}</h3>
                <p className="seasonBannerP">{seasonCategory?.text?.[lang]}</p>
            </div>
        </div>
    </div>
        
  )
}

export default SeasonBanner
