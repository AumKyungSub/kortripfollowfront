import React from 'react'

// Function Component
import HomeIcon from '../../../../features/homeIcon/HomeIcon'

// Page css
import './ThemeDetailBanner.style.css'

const ThemeDetailBanner = ({data, isFullMobile, isDesktop, lang}) => {
    const bgi = isDesktop 
        ? `${data.img?.link}2.jpg`
        : isFullMobile 
        ? `${data.img?.link}2M.jpg`
        : `${data.img?.link}2T.jpg`

    return (
        <div
            className='themeDetailBannerCover'
            style={
                {backgroundImage: `url(${bgi})`}
            }
        >
            {isFullMobile && <HomeIcon/>}
            <div className="themeDetailBannerTextCover">
                <h2 className='themeDetailBannerH2'>
                    {data.location?.name?.[lang]}
                    {data?.description?.star && ` ${data?.description?.star}성`}
                    {data.location?.chain && ` (${data.location?.chain?.[lang]})`}
                </h2>
                <p className='themeDetailBannerPr'>
                    <img src="/images/icon/regionIconS.png" alt="region" />
                    {data.location?.region?.[lang]}
                </p>
                <p className='themeDetailBannerP'>
                    {isDesktop
                        ? data.description?.slide?.[lang]
                        : data.description?.title?.[lang]}
                </p>
                </div>
        </div>
    )
}

export default ThemeDetailBanner
