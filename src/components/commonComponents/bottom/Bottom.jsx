import React from 'react'

// Page css
import './Bottom.style.css'

const Bottom = ({title, text, leftText, rightTitle, rightText}) => {
  const bottomImg = (title === "여행 중 잠깐의 휴식") ? "cafes" 
                    : (title === "대한민국의 매력") ? "taegeukgi"
                    : (title === "여행의 또 다른 재미") ? "restaurants"
                    : (title === "여행의 연장을 위한 충전") ? "lodgings"
                    : (title === "여행 중 에너지 충전") ? "foods"
                    : "";
                    
  return (
    <div className='bottomWholeCover'>
        <div className="bottomCover">
            <div className="bottomTextCover">
              <div className="bottomText">
                  <h3>{title}</h3>
                  <p>{text}</p>
              </div>
              <div className="bottomBox">
                  <span className="bottomLeftBox">
                      이달의 추천 <br /><br /> <a>{leftText}</a>
                  </span>
                  <span className="bottomRightBox">
                      {rightTitle} <br /><br /> <a>{rightText}</a>
                  </span>
              </div>
            </div>
            <div className="bottomImgCover">
              <img src={`/images/flag/${bottomImg}.jpg`} alt={`/images/flag/${bottomImg}.jpg`} />
            </div>
        </div>
    </div>
  )
}

export default Bottom
