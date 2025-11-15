import React from 'react'

// Page css
import './Bottom.style.css'

const Bottom = ({title, text, leftText, rightTitle, rightText}) => {
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
              <img src="/images/flag/taegeukgi.jpg" alt="Korean flag" />
            </div>
        </div>
    </div>
  )
}

export default Bottom
