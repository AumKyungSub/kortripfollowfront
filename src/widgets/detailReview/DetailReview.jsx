import React from 'react'

import { useTranslation } from 'react-i18next'

//Page css
import './DetailReview.style.css'

const DetailReview = ({data, isFullMobile}) => {

    const {t} = useTranslation();

    return (
        <>
            <section className='reviewCover'>
                {!isFullMobile ? 
                    <>
                        <h4 className="detailTitleMin768">{t("locationPage.info.review")}</h4>
                        <div className='emptyLine1px'></div>
                    </>
                :
                <>
                        <h6 className="detailTitleMax768">{t("locationPage.info.review")}</h6>

                    </>
                }
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
            {isFullMobile && <div className="emptyLine"></div>}
        </>
    )
}

export default DetailReview