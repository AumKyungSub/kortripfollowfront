import React from 'react'

// Components
import HomeIcon from '../../../functionComponents/HomeIcon'

// Page css
import './MainImage.style.css'

const MainImage = ({rankingData, isMobile, isFullMobile, isDesktop}) => {

  const bgi = isDesktop ? `${rankingData?.img?.link}2.jpg`
              : isFullMobile ? `${rankingData?.img?.link}2M.jpg`
              : `${rankingData?.img?.link}2T.jpg`

  return (
    <>
      <div 
        className='mainImageCover'
        style={
            {backgroundImage: `url(${bgi})`}
        }
      >
        {isFullMobile && <HomeIcon />}
        <div className='mainImageTextCover'>
          <div>
            <h2 className="locationName">
              {rankingData?.location?.name}
            </h2>
            <p className="locationAddress">
              <img src="/images/icon/regionIconS.png" alt="regionIcon" />
              {rankingData?.location?.region[1]}
            </p>
            <p className="locationSlogan">
              {rankingData?.description?.short}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainImage
