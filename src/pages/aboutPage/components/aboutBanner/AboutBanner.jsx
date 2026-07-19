import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Page css
import './AboutBanner.style.css'

const AboutBanner = ({lang}) => {

    const {t} = useTranslation();

    return (
        <div className="homeBannerBackground">
            <div className="aboutBannerWrapper">
              {/* 텍스트 영역 */}
                <div className="aboutBannerTextCover">
                    <p className='aboutBannerLocation'>
                        {t("about.aboutBanner.bannerAbout")}
                    </p>
                    <hr className='aboutBannerTextLine' />
                    <h1 className="aboutBannerName">
                        {t("about.aboutBanner.bannerTitle")}
                    </h1>
                    <p className="aboutBannerDetail">
                        {t("about.aboutBanner.bannerSlogan")}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutBanner