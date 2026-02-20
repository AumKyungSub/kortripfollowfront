import React from 'react'

// Components
import HomeIcon from '@/features/homeIcon/HomeIcon'

//Page css
import './LocationDetailBanner.style.css'

const LocationDetailBanner = ({rankingData, isFullMobile, isDesktop, lang}) => {
    const addressText = lang === "ko"
        ? rankingData?.location?.address?.ko?.[0]
        : rankingData?.location?.address?.en?.[1];

    const bgi = isDesktop 
        ? `${rankingData?.img?.link}2.jpg`
        : isFullMobile ? `${rankingData?.img?.link}2M.jpg`
        : `${rankingData?.img?.link}2T.jpg`

    return (
        <section 
            className='locationDetailBannerWrapper'
            style={
                {backgroundImage: `url(${bgi})`}
            }
        >
            {isFullMobile && <HomeIcon />}
            <div className='locationDetailBannerTextCover'>
                <h1 className="locationDetailBannerTextName">
                    {rankingData?.location?.name?.[lang]}
                </h1>
                <p className="locationDetailBannerTextAddress subFont">
                    <img src="/images/icon/regionIconS.png" alt="regionIcon" />
                    {addressText || ""}
                </p>
                <p className="locationDetailBannerTextSlogan">
                    {rankingData?.description?.short?.[lang]}
                </p>
            </div>
        </section>
    )
}

export default LocationDetailBanner