import React,{useState,useEffect} from 'react'

// Page css
import './LocInfo.style.css'

const LocInfo = ({rankingData}) => {
  const [isFixed, setIsFixed] = useState(false);
  const [initialTop, setInitialTop] = useState(0);
  const [rightPos, setRightPos] = useState(0);
  const [locWidth, setLocWidth] = useState(0);

useEffect(() => {
  const headerHeight = 10;
  const footerHeight = 103;
  const mainEl = document.querySelector('.mainImageCover');
  const explainEl = document.querySelector('.explainTextImgCover');
  const topRecommendEl = document.querySelector('.topRecommendCover');
  const locInfoEl = document.querySelector('.locationInfoCover');

  if (!mainEl || !explainEl || !topRecommendEl || !locInfoEl) return;

  const updatePosition = () => {
    if (!mainEl || !explainEl || !topRecommendEl || !locInfoEl) return;

    const viewportWidth = window.innerWidth;
    const containerWidth = Math.min(1280, viewportWidth);
    const padding = viewportWidth >= 1280 ? 0 : 20;
    const right = (viewportWidth - containerWidth) / 2 + padding;
    setRightPos(right);

    const explainWidth = explainEl.offsetWidth;
    const width = viewportWidth >= 1280 ? 1250 - explainWidth : viewportWidth - (explainWidth + 60);
    setLocWidth(width);

    const mainBottom = mainEl.getBoundingClientRect().bottom + window.scrollY;
    const topRecommendTop = topRecommendEl.getBoundingClientRect().top + window.scrollY;
    const locInfoHeight = locInfoEl.offsetHeight;

    const scrollY = window.scrollY;

    const startFix = scrollY + headerHeight >= mainBottom;
    const stopFix = scrollY + headerHeight + locInfoHeight >= topRecommendTop - footerHeight;

    if (startFix && !stopFix) {
      setIsFixed(true);
    } else if (stopFix) {
      setIsFixed(false);
      setInitialTop(topRecommendTop - footerHeight - locInfoHeight);
    } else {
      setIsFixed(false);
      setInitialTop(mainBottom);
    }
  };

  // 최초 접근시 바로 실행
  updatePosition();
  // 최초 접근시 한 번 실행 (렌더 완료 후 계산)
  setTimeout(updatePosition, 50);

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
          <h3 className="locationInfoTitle">이용 정보</h3>
          <div className="locationInfoTextCover">
              <p className="operatingHourTitle">
                  <img src="/images/icon/clockIcon.png" alt="opHour" />
                  운영시간
              </p>
              <p className="operatingHour">
                  {rankingData?.operating?.operatingHour?rankingData?.operating?.operatingHour 
                  : "24시 운영"}
              </p>
              <p className="closeDayTitle">
                  <img src="/images/icon/calendarIcon.png" alt="clDay" />
                  휴무일
              </p>
              <p className="closeDay">
                  {rankingData?.operating?.closeDay?rankingData?.operating?.closeDay 
                  : "연중무휴"}
              </p>
              <p className="entranceFeeTitle">
                  <img src="/images/icon/feesIcon.png" alt="enFee" />
                  입장료
              </p>
              <p className="entranceFee">
                  {rankingData?.operating?.entranceFee?rankingData?.operating?.entranceFee 
                  : "무료"}
              </p>
              {rankingData?.location?.homepage?
              <>
              <p className="entranceFeeWeb">
                  <img src="/images/icon/webIcon.png" alt="enFee" />
                  웹사이트
              </p>
              <a href={rankingData?.location?.homepage} target='_blank' className='webLink'>
                방문하기
                <img src="/images/icon/rightSingleArrowIcon.png" alt="/images/icon/rightSingleArrowIcon.png" />
              </a>
              </>
            : <></>}
              <p className="warningInfo">모든 정보는 변경될 수 있습니다.</p>
          </div>
          {rankingData?.review?.existence?
              <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                <span className='reviewPC'>찐리뷰 보러가기</span>
              </a>
            : <div>
              <span className='reviewPCYet'>리뷰가 준비중 입니다</span>
            </div>
          }
    </div>
    </>
  )
}

export default LocInfo
