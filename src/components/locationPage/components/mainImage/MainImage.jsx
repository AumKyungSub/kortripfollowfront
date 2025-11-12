import React from 'react'
// (hook) Device Size
import { useResponsive } from '../../../../hooks/ResponsiveUsed'

// Components
import HomeIcon from '../../../functionComponents/HomeIcon'

// Page css
import './MainImage.style.css'

const MainImage = ({rankingData}) => {
  // maxWidth: 479, minWidth: 1024
  const {isMobile, isDesktop} = useResponsive();

  console.log(rankingData);
  return (
    <>
      <div className='mainImageCover'>
        {!isDesktop && <HomeIcon />}
        <div>
          <img src={isMobile?rankingData?.img?.link+"2M.jpg"
            :!isDesktop?rankingData?.img?.link+"2T.jpg"
            :rankingData?.img?.link+"2.jpg"
          } alt={rankingData?.img?.link+"2.jpg"} className='mainImage' />
        </div>
        <div className='mainImageTextCover'>
          <div>
            <h2 className="locationName">{rankingData?.location?.name}</h2>
            <p className="locationAddress">
              <img src="/images/icon/regionIcon.png" alt="regionIcon" />
              {rankingData?.location?.region[1]}
            </p>
            <p className="locationSlogan">{rankingData?.description?.short}</p>
          </div>
          {rankingData?.review.existence?
              <a href={rankingData?.review?.link} target="_blank" rel="noopener noreferrer" className='reviewCover'>
                <span className='review'>찐리뷰</span>
              </a>
            : <div></div>
          }
        </div>
        <div className="emptyLine"></div>
      </div>
    </>
  )
}

export default MainImage
