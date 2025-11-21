import React from 'react'

// Page css
import './Explain.style.css'

const Explain = ({rankingData, isDesktop, isTablet, isFullMobile}) => {

  return (
    <div className='explainWholeCover'>
      <div className='explainCover'>
        {!isFullMobile && <h5 className='explainNameF'>소개</h5>}
        {!isFullMobile && <div className="emptyLine1px"></div>}
        <div className="explainTextImgCover">
          <div className="explainImgCover">
            {isTablet ? (
              <img src={rankingData?.img?.link+"3.jpg"} alt="explainImg" />
            ) : isDesktop ? (
              <img src={rankingData?.img?.link+"4.jpg"} alt="explainImg" />
            ) : (
              <></>
            )}
          </div>
          <div className="explainTextCover">
            <h1 className="explainTitle">{rankingData?.description?.title}</h1>
            <p className="explain">{rankingData?.description?.main}</p>
            <p className="explainLast">{rankingData?.description?.last}</p>
          </div>
        </div>
      </div>
      {isFullMobile && <div className="emptyLine"></div>}
    </div>
  )
}

export default Explain
