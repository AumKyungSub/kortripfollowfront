import React from 'react'

import { useTranslation } from 'react-i18next'

//Page css
import './DetailLink.style.css'

const DetailLink = ({data, isFullMobile}) => {

    const {t} = useTranslation();

    const goToHomepage = () => {
        window.open(data?.location?.homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(data?.location?.instagram, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="detailLinkWrapper">
                {data?.location?.homepage
                ?
                    <>
                        <p className="preTitle14px600b54a2f">
                            <span className="preTitle14px600b54a2fLine"></span>
                            Links
                        </p>
                        <p className="title18px20px700">{t("detailPage.common.link.title")}</p>

                        <div className="detailLinkCover">
                            {data?.location?.homepage &&
                                <span className='detailLinkIcon' onClick={goToHomepage}>
                                    <img src="/images/icon/homepageIcon.png" alt="homepage" />
                                </span> 
                            }
                            {data?.location?.instagram &&
                                <span className='detailLinkIcon' onClick={goToInstagram}>
                                    <img src="/images/logo/instaIcon.png" alt="instagram" />
                                </span>
                            }
                        </div>
                    </>
                : 
                    <>
                        <p className="preTitle14px600b54a2f">
                            <span className="preTitle14px600b54a2fLine"></span>
                            Links
                        </p>
                        <p className="title18px20px700">{t("detailPage.common.link.title")}</p>
                        <p className='detailLinkNoLink'>{t("detailPage.common.link.noLink")}</p>
                    </>
                }
            </section>
            {isFullMobile && <div className="emptyLine"></div>}
        </>
    )
}

export default DetailLink