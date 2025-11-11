import React from 'react'
// (hook) Device Size
import { useResponsive } from '../../../../hooks/ResponsiveUsed';

import { Link } from 'react-router-dom'

const BannerComponent = ({rankingsDataSlide}) => {
  // maxWidth: 767, minWidth: 1024
  const {isFullMobile, isDesktop} = useResponsive();

  return (
    <>
      <Link to={`/location/${rankingsDataSlide?.id}`}>
        <img src={isFullMobile?rankingsDataSlide?.img?.link+"3M.jpg"
          :!isDesktop?rankingsDataSlide?.img?.link+"3T.jpg"
          :rankingsDataSlide?.img?.link+"3.jpg"} 
          alt={rankingsDataSlide?.img?.link+"3.jpg"} 
        />
        <div className="swiperText01">
            <strong>{rankingsDataSlide?.location?.name}<br/><span>{rankingsDataSlide?.location?.english}</span></strong>
            <p className="swiperP01">{rankingsDataSlide?.description?.slide}</p>
        </div>
      </Link>
    </>
  )
}

export default BannerComponent