import React,{useState,useEffect} from 'react'

// Page css
import './LocInfo.style.css'

const LocInfo = ({rankingData}) => {
  const [isFixed, setIsFixed] = useState(false);
  const [initialTop, setInitialTop] = useState(0);
  const [rightPos, setRightPos] = useState(0); // 초기값 padding
  const [locWidth, setLocWidth] = useState(0); 

  useEffect(() => {
  const headerHeight = 72;
  const footerHeight = 320;
  const mainEl = document.querySelector('.mainImageCover');
  const explainEl = document.querySelector('.explainTextCover');
  const topRecommendEl = document.querySelector('.topRecommendCover');

  const updatePosition = () => {
    if (!mainEl || !explainEl || !topRecommendEl) return;

    const viewportWidth = window.innerWidth;
    const containerWidth = Math.min(1440, viewportWidth);
    const padding = viewportWidth >= 1440 ? 0 : 20;
    const right = (viewportWidth - containerWidth) / 2 + padding;
    setRightPos(right);

    const explainWidth = explainEl.offsetWidth;
    let locWidth = 0;
    if (viewportWidth >= 1440) {
      locWidth = 1388 - explainWidth;
    } else {
      locWidth = viewportWidth - (explainWidth + 60);
    }
    setLocWidth(locWidth);

    const mainBottom = mainEl.getBoundingClientRect().bottom + window.scrollY;
    setInitialTop(mainBottom);

    // topRecommend 위치 계산
    const topRecommendTop = topRecommendEl.getBoundingClientRect().top + window.scrollY;
    
    // 스크롤 위치
    const scrollY = window.scrollY;
    
    // fixed 조건
    if (scrollY + headerHeight >= mainBottom && scrollY + headerHeight + locWidth < topRecommendTop - footerHeight) {
      setIsFixed(true);
    } else if (scrollY + headerHeight >= mainBottom && scrollY + headerHeight + locWidth >= topRecommendTop - footerHeight) {
      setIsFixed(false);
      setInitialTop(topRecommendTop - footerHeight - locWidth);
    } else {
      setIsFixed(false);
    }
  };

  updatePosition();
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  return () => {
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition);
  };
}, []);

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
            <h3 className="locationInfoTitle">기본 정보</h3>
            <p className="operatingHourTitle">
                <img src="/images/icon/clockIcon.png" alt="opHour" />
                운영시간
            </p>
            <p className="operatingHour">
                {rankingData?.operatingHour?rankingData?.operatingHour 
                : "24시 운영"}
            </p>
            <p className="closeDayTitle">
                <img src="/images/icon/calendarIcon.png" alt="clDay" />
                휴무일
            </p>
            <p className="closeDay">
                {rankingData?.closeDay?rankingData?.closeDay 
                : "연중무휴"}
            </p>
            <p className="entranceFeeTitle">
                <img src="/images/icon/feesIcon.png" alt="enFee" />
                입장료
            </p>
            <p className="entranceFee">
                {rankingData?.entranceFee?rankingData.entranceFee 
                : "무료"}
            </p>
            <p className="warningInfo">모든 정보는 변경될 수 있습니다.</p>
            {rankingData?.review?
                <a href={rankingData?.reviewAddress} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                  <span className='reviewPC'>찐리뷰 보러가기</span>
                </a>
              : <div>
                <span className='reviewPC'>리뷰가 준비중 입니다</span>
              </div>
            }
    </div>
    </>
  )
}

export default LocInfo
