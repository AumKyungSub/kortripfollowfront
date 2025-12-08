import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './Explain.style.css'

const Explain = ({rankingData, isDesktop, isTablet, isFullMobile, lang}) => {
  const { t } = useTranslation();

  return (
    <div className='explainWholeCover'>
      <div className='explainCover'>
        {!isFullMobile && <h5 className='explainNameF'>{t("locationPage.explain.title")}</h5>}
        {!isFullMobile && <div className="emptyLine1px"></div>}
        <div className="explainTextImgCover">
          <div className="explainImgCover">
            {isTablet ? (
              <img src={rankingData?.img?.link+"3.jpg"} alt="explainImg" />
            ) : isDesktop ? (
              <img src={rankingData?.img?.link+"4.jpg"} alt="explainImg" />
            ) : (
              <></>
            )}
          </div>
          <div className="explainTextCover">
            <h1 className="explainTitle">{rankingData?.description?.title?.[lang]}</h1>
            <p className="explain">{rankingData?.description?.main?.[lang]}</p>
            <p className="explainLast">{rankingData?.description?.last?.[lang]}</p>
          </div>
        </div>
      </div>
      {isFullMobile && <div className="emptyLine"></div>}
    </div>
  )
}

export default Explain
