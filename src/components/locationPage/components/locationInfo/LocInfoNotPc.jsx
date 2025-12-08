import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './LocInfo.style.css'

const LocInfoNotPc = ({rankingData, lang}) => {
    const {t} = useTranslation();

    const goToHomepage = () => {
        window.open(rankingData?.location?.homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(rankingData?.location?.instagram, "_blank", "noopener,noreferrer");
    }
    
  return (
    <>
    <div className='locationInfoWholeCover'>
      <div className="locationInfoCover">
        <p className="locationInfoTitle">
            {t("locationPage.info.operating")}
        </p>
        <p className="operatingHour">
            {rankingData?.operating?.operatingHour?.[lang] || t("locationPage.info.allday")}
        </p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        <p className="locationInfoTitle">
            {t("locationPage.info.closedDay")}
        </p>
        <p className="closeDay">
            {rankingData?.operating?.closeDay?.[lang] || t("locationPage.info.openAll")}
        </p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        <p className="locationInfoTitle">
            {t("locationPage.info.entrance")}
        </p>
        <p className="entranceFee">
            {rankingData?.operating?.entranceFee?.[lang] || t("locationPage.info.free")}
        </p>
        <p className="warningInfo">{t("locationPage.info.warning")}</p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        {rankingData?.location?.homepage
        ?
        <>
        <p className="locationInfoTitle">
            {t("locationPage.info.sns")}
        </p>
        <div className="locationInfoLinkCover">
          {rankingData?.location?.homepage &&
              <span className='locationInfoSpan' onClick={goToHomepage}>
                  <img src="/images/icon/homepageIcon.png" alt="homepage" />
              </span> 
          }
          {rankingData?.location?.instagram &&
              <span className='locationInfoSpan' onClick={goToInstagram}>
                  <img src="/images/icon/instaIcon.png" alt="instagram" />
              </span>
          }
        </div>
        </>
        : <><p>{t("locationPage.info.noLink")}</p></>}
      </div>
    <div className="emptyLine"></div>
      <div className="reviewCover">
        <p className="locationInfoTitle">
            {t("locationPage.info.review")}
        </p>
        {rankingData?.review?.existence?
            <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
              <span className='reviewPC'>{t("locationPage.info.reviewGo")}</span>
            </a>
          : <div>
            <span className='reviewPCYet'>{t("locationPage.info.reviewNone")}</span>
          </div>
        }
      </div>
    </div>
    <div className="emptyLine"></div>
    </>
  )
}

export default LocInfoNotPc
