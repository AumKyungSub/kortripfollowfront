import React from 'react'

// Components
import HomeIcon from '@/features/homeIcon/HomeIcon'

// Page css
import './DetailBanner.style.css'

const DetailBanner = ({
    name,
    subName,
    address,
    slogan,
    imgLink,
    isFullMobile,
    isDesktop
}) => {

    const bgi = isDesktop
        ? `${imgLink}2.jpg`
        : isFullMobile
        ? `${imgLink}2.jpg`
        : `${imgLink}2.jpg`
        
    return (
        <section
            className='detailBannerWrapper'
            style={{ backgroundImage: `url(${bgi})` }}
        >
            {isFullMobile && <HomeIcon />}

            <div className='detailBannerTextCover'>
                <h1 className="detailBannerTextName">
                    {name}
                    {subName && ` ${subName}`}
                </h1>

                {address && (
                    <p className="detailBannerTextAddress subFont">
                        <img src="/images/icon/regionIconS.png" alt="regionIcon" />
                        {address}
                    </p>
                )}

                {slogan && (
                    <p className="detailBannerTextSlogan">
                        {slogan}
                    </p>
                )}
            </div>
        </section>
    )
}   

export default DetailBanner