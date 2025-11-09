import React from 'react'

// Page css
import './LocInfo.style.css'

const LocInfoNotPc = ({rankingData}) => {
  return (
    <>
    <div className='locationInfoCover'>
            <h3 className="locationInfoTitle">기본 정보</h3>
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
                {rankingData?.operating?.entranceFee?rankingData.operating?.entranceFee 
                : "무료"}
            </p>
            <p className="warningInfo">모든 정보는 변경될 수 있습니다.</p>
            {rankingData?.review?.existence?
                <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
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

export default LocInfoNotPc
