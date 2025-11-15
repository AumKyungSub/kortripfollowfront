import React from 'react'

// Function Component
import HomeIcon from '../../../functionComponents/HomeIcon'

// Page css
import './ThemeDetailBanner.style.css'

const ThemeDetailBanner = ({data, isMobile, isFullMobile, isDesktop}) => {
    const bgi = isDesktop ? `${data.img?.link}2.jpg`
                : isFullMobile ? `${data.img?.link}2T.jpg`
                : `${data.img?.link}2M.jpg`

    return (
        <div
            className='themeDetailBannerCover'
            style={
                {backgroundImage: `url(${bgi})`}
            }
        >
            {!isDesktop && <HomeIcon/>}
            <div className="themeDetailBannerTextCover">
                <h2 className='themeDetailBannerH2'>
                    {data.location?.name}           
                </h2>
                <p className='themeDetailBannerPr'>
                    <img src="/images/icon/regionIconS.png" alt="region" />
                    {data?.location?.region[1]}
                </p>
                {isDesktop ? 
                    <p className='themeDetailBannerP'>
                        {data.description?.slide}
                    </p>
                :
                    <p className='themeDetailBannerP'>
                        {data.description?.title}
                    </p>
                }
                </div>
        </div>
    )
}

export default ThemeDetailBanner
