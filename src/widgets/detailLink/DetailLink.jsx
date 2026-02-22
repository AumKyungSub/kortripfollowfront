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
                        {!isFullMobile ? 
                            <>
                                <h4 className="detailTitleMin768">{t("locationPage.info.sns")}</h4>
                                <div className='emptyLine1px'></div>
                            </>
                        :
                            <>
                                <h4 className="detailTitleMax768">{t("locationPage.info.sns")}</h4>
                            </>
                        }
                        <div className="detailLinkCover">
                            {data?.location?.homepage &&
                                <span className='detailLinkIcon' onClick={goToHomepage}>
                                    <img src="/images/icon/homepageIcon.png" alt="homepage" />
                                </span> 
                            }
                            {data?.location?.instagram &&
                                <span className='detailLinkIcon' onClick={goToInstagram}>
                                    <img src="/images/icon/instaIcon.png" alt="instagram" />
                                </span>
                            }
                        </div>
                    </>
                : 
                    <>
                        {isFullMobile && <p>{t("locationPage.info.noLink")}</p>}
                    </>
                }
            </section>
            {isFullMobile && <div className="emptyLine"></div>}
        </>
    )
}

export default DetailLink