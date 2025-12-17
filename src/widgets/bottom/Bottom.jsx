import React from 'react'
/*------------------------hooks-----------------------------------*/
// Transition Language
import { useTranslation } from 'react-i18next';
/*------------------------/hooks-----------------------------------*/

// Page css
import './Bottom.style.css'

const Bottom = ({type}) => {
  // Transition Language
  const {t} = useTranslation();
  // type 값 소문자 변환
  const typeName = type.toLowerCase();
  // translation json에서 값 가져오기
  const keyValue = `bottom.${typeName}`;
                    
  return (
    <article className='bottomWholeCover'>
        <div className="bottomCover">
            <div className="bottomTextCover">
              <div className="bottomText">
                  <h3>{t(`${keyValue}.title`)}</h3>
                  <p>{t(`${keyValue}.text`)}</p>
              </div>
              <div className="bottomBox">
                  <span className="bottomLeftBox">
                      {t(`${keyValue}.leftTitle`)} <br /><br /> <a>{t(`${keyValue}.leftText`)}</a>
                  </span>
                  <span className="bottomRightBox">
                      {t(`${keyValue}.rightTitle`)} <br /><br /> <a>{t(`${keyValue}.rightText`)}</a>
                  </span>
              </div>
            </div>
            <div className="bottomImgCover">
              <img src={`/images/flag/${typeName}.jpg`} alt={`/images/flag/${typeName}.jpg`} />
            </div>
        </div>
    </article>
  )
}

export default Bottom
