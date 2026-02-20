import React from 'react'

import { useTranslation } from 'react-i18next'

//Page css
import './LocationDetailExplain.style.css'

const LocationDetailExplain = ({rankingData, isDesktop, isTablet, isFullMobile, lang}) => {
    const { t } = useTranslation();

    const textBackImg = `${rankingData?.img?.link}3.jpg`;
    
    return (
        <div className='locationDetailExplainWrapper'>
            <div className='locationDetailExplainCover'>
                {!isFullMobile &&
                    <>
                        <h4 className='detailTitleMin768'>{t("locationPage.explain.title")}</h4>
                        <div className="emptyLine1px"></div>
                    </>
                }
                <div className="locationDetailExplainTextImgCover">
                    <div 
                        className="locationDetailExplainImgCover" 
                        style={{ backgroundImage: `url(${textBackImg})` }}
                    ></div>
                    <div className="locationDetailExplainTextCover">
                        <h3 className="locationDetailExplainTitle">{rankingData?.description?.title?.[lang]}</h3>
                        <p className="locationDetailExplain">{rankingData?.description?.main?.[lang]}</p>
                        <p className="locationDetailExplainLast subFont">{rankingData?.description?.last?.[lang]}</p>
                    </div>
                </div>
            </div>
            {isFullMobile && <div className="emptyLine"></div>}
        </div>
    )
}

export default LocationDetailExplain