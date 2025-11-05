import React from 'react'

// Page css
import './RegionBottom.style.css'

const RegionBottom = () => {
  return (
    <div className='regionBottomWholeCover'>
        <div className="regionBottomCover">
            <div className="regionBottomTextCover">
              <div className="regionBottomText">
                  <h3>대한민국의 매력</h3>
                  <p>대한민국은 사계절의 뚜렷한 변화와 함께 각 지역마다 독특한 문화와 자연경관을 자랑합니다. 북쪽의 산악지대부터 남쪽의 아름다운 해안선까지, 다양한 매력을 가진 여행지들이 여러분을 기다립니다.</p>
              </div>
              <div className="regionBottomBox">
                  <span className="regionBottomLeftBox">
                      이달의 추천 <br /><br /> <a>카페산</a>
                  </span>
                  <span className="regionBottomRightBox">
                      추천 계절 <br /><br /> <a>사계절</a>
                  </span>
              </div>
            </div>
            <div className="regionBottomImgCover">
              <img src="/images/flag/taegeukgi.jpg" alt="Korean flag" />
            </div>
        </div>
    </div>
  )
}

export default RegionBottom
