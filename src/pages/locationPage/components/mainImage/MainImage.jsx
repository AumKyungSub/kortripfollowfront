import React from 'react'

// Components
import HomeIcon from '../../../../features/homeIcon/HomeIcon'

// Page css
import './MainImage.style.css'

const MainImage = ({rankingData, isFullMobile, isDesktop, lang}) => {
  const addressText = lang === "ko"
    ? rankingData?.location?.address?.ko?.[0]
    : rankingData?.location?.address?.en?.[1];

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
              {rankingData?.location?.name?.[lang]}
            </h2>
            <p className="locationAddress">
              <img src="/images/icon/regionIconS.png" alt="regionIcon" />
              {addressText || ""}
            </p>
            <p className="locationSlogan">
              {rankingData?.description?.short?.[lang]}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainImage
