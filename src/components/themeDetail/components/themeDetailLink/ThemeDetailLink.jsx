import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './ThemeDetailLink.style.css'

const ThemeDetailLink = ({data, isFullMobile}) => {
    const {t} = useTranslation();
    const goToHomepage = () => {
        window.open(data?.location?.homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(data?.location?.instagram, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            {isFullMobile && <div className='emptyLine'></div>}
            <section className="themeDetailLinkWholeCover">
                <h1 className='themeDetailLinkH1'>{t("locationPage.info.sns")}</h1>
                {!isFullMobile && <div className='emptyLine1px'></div>}
                <div className="themeDetailLinkCover">
                    {data?.location?.homepage &&
                        <span className='themeDetailLinkSpan' onClick={goToHomepage}>
                            <img src="/images/icon/homepageIcon.png" alt="homepage" />
                        </span> 
                    }
                    {data?.location?.instagram &&
                        <span className='themeDetailLinkSpan' onClick={goToInstagram}>
                            <img src="/images/icon/instaIcon.png" alt="instagram" />
                        </span>
                    }
                </div>
            </section>
            
            {isFullMobile && <div className='emptyLine'></div>}
            <section className="themeDetailLinkWholeCover">
                <h1 className='themeDetailLinkH1'>{t("locationPage.info.review")}</h1>
                {!isFullMobile && <div className='emptyLine1px'></div>}
                {data?.review?.existence?
                    <a href={data?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                        <span className='reviewPC'>{t("locationPage.info.reviewGo")}</span>
                    </a>
                    :
                    <div>
                        <span className='reviewPCYet'>{t("locationPage.info.reviewNone")}</span>
                    </div>
                }
            </section>
        </>
    )
}

export default ThemeDetailLink
