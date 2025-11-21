import React from 'react'

// Page css
import './LocInfo.style.css'

const LocInfoNotPc = ({rankingData}) => {

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
            운영 시간
        </p>
        <p className="operatingHour">
            {rankingData?.operating?.operatingHour
            ? rankingData?.operating?.operatingHour 
            : "24시 운영"}
        </p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        <p className="locationInfoTitle">
            휴무일
        </p>
        <p className="closeDay">
            {rankingData?.operating?.closeDay
            ? rankingData?.operating?.closeDay 
            : "연중무휴"}
        </p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        <p className="locationInfoTitle">
            입장료 및 기타
        </p>
        <p className="entranceFee">
            {rankingData?.operating?.entranceFee
            ? rankingData.operating?.entranceFee 
            : "무료"}
        </p>
        <p className="warningInfo">모든 정보는 변경될 수 있습니다.</p>
      </div>
      <div className="emptyLine"></div>
      <div className="locationInfoCover">
        {rankingData?.location?.homepage
        ?
        <>
        <p className="locationInfoTitle">
            SNS/웹사이트
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
        : <><p>홈페이지가 없습니다.</p></>}
      </div>
    <div className="emptyLine"></div>
      <div className="reviewCover">
        <p className="locationInfoTitle">
            찐리뷰
        </p>
        {rankingData?.review?.existence?
            <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
              <span className='reviewPC'>찐리뷰 보러가기</span>
            </a>
          : <div>
            <span className='reviewPCYet'>리뷰가 준비중 입니다</span>
          </div>
        }
      </div>
    </div>
    <div className="emptyLine"></div>
    </>
  )
}

export default LocInfoNotPc
