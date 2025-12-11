import React,{useState,useEffect} from 'react'

import { useTranslation } from 'react-i18next';

// Page css
import './LocInfo.style.css'

const LocInfo = ({rankingData, isFullMobile, lang}) => {
  const { t } = useTranslation();
  const [isFixed, setIsFixed] = useState(false);
  const [initialTop, setInitialTop] = useState(0);
  const [rightPos, setRightPos] = useState(0);
  const [locWidth, setLocWidth] = useState(0);

useEffect(() => {
  const headerHeight = 10;
  const mainEl = document.querySelector('.mainImageCover');
  const explainEl = document.querySelector('.explainTextImgCover');
  const topRecommendEl = document.querySelector('.topRecommendCover');
  const topParkingEl = document.querySelector('.topParkingWholeCover');
  const locInfoEl = document.querySelector('.locationInfoCover');

  if (!mainEl || !explainEl || !topRecommendEl || !topParkingEl || !locInfoEl) return;

  const updatePosition = () => {
    if (!mainEl || !explainEl || !topRecommendEl || !topParkingEl || !locInfoEl) return;

    const rightWholeEl = document.querySelector('.locationDetailRightWholeCover');

    const viewportWidth = window.innerWidth;
    const containerWidth = Math.min(1440, viewportWidth);
    const right = (viewportWidth - containerWidth) / 2;
    setRightPos(right);

    // 오른쪽 박스 width 고정
    if (rightWholeEl) {
      setLocWidth(rightWholeEl.offsetWidth);
    }

    const scrollY = window.scrollY;

    // locationInfo 시작점(고정 시작점)
    const mainBottom = mainEl.getBoundingClientRect().bottom + scrollY;

    // 멈추는 기준이 되는 왼쪽 "위치 정보" 박스 top
    const parkingTop = topParkingEl.getBoundingClientRect().top + scrollY;

    // locationInfoCover의 실제 높이
    const locInfoHeight = locInfoEl.offsetHeight;

    // 🟦 1. fixed 시작 조건
    const startFix = scrollY + headerHeight >= mainBottom;

    // 🟥 2. fixed 종료 조건 (TOP == TOP)
    const stopFix = scrollY + headerHeight >= parkingTop;

    if (startFix && !stopFix) {
      // fixed 상태
      setIsFixed(true);
    } else if (stopFix) {
      // TOP 위치 딱 맞춰서 absolute 정지
      setIsFixed(false);
      setInitialTop(parkingTop);
    } else {
      // 초기 absolute 위치
      setIsFixed(false);
      setInitialTop(mainBottom);
    }
  };

  updatePosition(); // 초기 실행
  setTimeout(updatePosition, 50);

  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  return () => {
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition);
  };
}, []);

    const goToHomepage = () => {
        window.open(rankingData?.location?.homepage, "_blank", "noopener,noreferrer");
    }

    const goToInstagram = () => {
        window.open(rankingData?.location?.instagram, "_blank", "noopener,noreferrer");
    }

  return (
    <>
    <div 
        className='locationInfoCover'
        style={{
            position: isFixed ? 'fixed' : 'absolute',
            top: isFixed ? '0px' : `${initialTop}px`,
            right: `${rightPos}px`,
            width: `${locWidth}px`,
        }}>
          <h3 className="explainNameF">{t("locationPage.info.title")}</h3>
          {!isFullMobile && <div className='emptyLine1px'></div>}
          <div className="locationInfoTextCover">
              <div className="operatingHourTitle">
                  <img src="/images/icon/clockIcon.png" alt="opHour" />
                  <p className='locInfoTitle'>{t("locationPage.info.operating")}</p>
              </div>
              <p className="locInfoText">
                {rankingData?.operating?.operatingHour?.[lang] || t("locationPage.info.allday")}
              </p>
              <div className="closeDayTitle">
                <img src="/images/icon/bookingIcon.png" alt="clDay" />
                <p className='locInfoTitle'>{t("locationPage.info.closedDay")}</p>
              </div>
              <p className="locInfoText">
                {rankingData?.operating?.closeDay?.[lang] || t("locationPage.info.openAll")}
              </p>
              <div className="entranceFeeTitle">
                  <img src="/images/icon/feesIcon.png" alt="enFee" />
                  <p className='locInfoTitle'>{t("locationPage.info.entrance")}</p>
              </div>
              <p className="locInfoText">
                {rankingData?.operating?.entranceFee?.[lang] || t("locationPage.info.free")}
              </p>
              <p className="warningInfo">{t("locationPage.info.warning")}</p>
          </div>

          {rankingData?.location?.homepage &&
            <>
              <p className="explainName">{t("locationPage.info.sns")}</p>
              {!isFullMobile && <div className='emptyLine1px'></div>}
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
          }
          
        <p className="explainName">{t("locationPage.info.review")}</p>
        {!isFullMobile && <div className='emptyLine1px'></div>}
          {rankingData?.review?.existence?
              <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                <span className='reviewPC'>{t("locationPage.info.reviewGo")}</span>
              </a>
            : <div>
              <span className='reviewPCYet'>{t("locationPage.info.reviewNone")}</span>
            </div>
          }
    </div>
    </>
  )
}

export default LocInfo
