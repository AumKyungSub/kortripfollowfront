import React from 'react'

// Page css
import './Parking.style.css'

const Parking = ({rankingData}) => {

  const kakaoMapLink = `https://map.kakao.com/link/to/${rankingData?.parking?.addressID}`;
  const singleRightArrow = "/images/icon/rightSingleArrowIcon.png";

  return (
    <div className='topParkingWholeCover'>
        <div className="topParkingInfo">
          <div className='parkingAllCover'>
            <h5 className='explainName'>주차 정보</h5>
          <div className='parkingInfoAllCover'>
            <div className="parkingInfoCover">
              <div className="parkingInfoIcon">
                <img src="/images/icon/parkingIcon.png" alt="parkingIcon" />
              </div>
              <div className="parkingInfoText">
                <p className='topParkingTableHead1'>주차 가능 여부</p>
                <p className='parkT'>{rankingData?.parking?.existence == true?"가능":"불가"}</p>
              </div>
            </div>
            <div className="parkingInfoCover">
              <div className="parkingInfoIcon">
                <img src="/images/icon/feeIcon.png" alt="feeIcon" />
              </div>
              <div className="parkingInfoText">
                <p className='topParkingTableHead2'>주차 비용 여부</p>
                <p className='parkT'>{rankingData?.parking?.fee == true?"유료":"무료"}</p>
              </div>
            </div>
            <div className="parkingInfoCover">
              <div className="parkingInfoIcon">
                <img src="/images/icon/carIcon.png" alt="carIcon" />
              </div>
              <div className="parkingInfoText">
                <p className='parkP'><strong>추천 주차 주소</strong> <br/>
                  <a href={rankingData?.parking?.existence == true?kakaoMapLink:"#"} target="_blank" rel="noopener noreferrer" className='parkT parkA'>
                      {rankingData?.parking?.existence == true?(
                        <>
                          {rankingData?.parking?.address+" "}
                          <img src={singleRightArrow} alt="singleRightArrow" />
                        </>
                      ):""}
                  </a>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      <div className="emptyLine"></div>
    </div>
  )
}

export default Parking
