import React from 'react'

import { useTranslation } from 'react-i18next'

//Page css
import './DetailLink.style.css'

const DetailLink = ({data, isFullMobile}) => {

    const {t, i18n} = useTranslation();
    const homepage = data?.location?.homepage;
    const instagram = data?.location?.instagram;
    const hasLinks = Boolean(homepage || instagram);
    const isEnglish = i18n.resolvedLanguage?.startsWith('en');

    const goToHomepage = () => {
        window.open(homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(instagram, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="detailLinkWrapper">
                {hasLinks
                ?
                    <>
                        <p className="preTitle14px600b54a2f">
                            <span className="preTitle14px600b54a2fLine"></span>
                            Links
                        </p>
                        <p className="title18px20px700">{t("detailPage.common.link.title")}</p>

                        <div className="detailLinkCover">
                            {homepage &&
                                <button type="button" className='detailLinkIcon' onClick={goToHomepage}>
                                    <img src="/images/icon/homepageIcon.png" alt="" />
                                    <span>{isEnglish ? 'Website' : '홈페이지'}</span>
                                </button> 
                            }
                            {instagram &&
                                <button type="button" className='detailLinkIcon' onClick={goToInstagram}>
                                    <img src="/images/logo/instaIcon.png" alt="" />
                                    <span>Instagram</span>
                                </button>
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
