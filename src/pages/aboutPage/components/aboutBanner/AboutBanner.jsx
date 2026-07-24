import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './AboutBanner.style.css'

const AboutBanner = () => {
    // Language 사용
    const {t} = useLanguage();

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