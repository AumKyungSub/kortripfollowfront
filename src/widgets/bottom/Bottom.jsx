import React from 'react'

import { useTranslation } from 'react-i18next';

// Page css
import './Bottom.style.css'

const Bottom = ({title, text, leftText, rightTitle, rightText, leftTitle}) => {
  const {t} = useTranslation();
  const bottomImg = (title === t("theme.bottomTitle.cafe")) ? "cafes" 
                    : (title === t("regionPage.bottomTitle")) ? "taegeukgi"
                    : (title === t("theme.bottomTitle.restaurant")) ? "restaurants"
                    : (title === t("theme.bottomTitle.lodging")) ? "lodgings"
                    : (title === t("theme.bottomTitle.food")) ? "foods"
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
                      {leftTitle} <br /><br /> <a>{leftText}</a>
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
