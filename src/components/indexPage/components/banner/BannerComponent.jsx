import React from 'react'

import { useNavigate } from 'react-router-dom'

const BannerComponent = ({rankingsDataSlide, isFullMobile, isDesktop}) => {
  const navigate = useNavigate();

  const goToLocationDetail = () => {
    if (!rankingsDataSlide?.id) return;

    navigate (`/location/${rankingsDataSlide?.id}`);
  };

  return (
    <div onClick={goToLocationDetail}>
        <img 
          src={isFullMobile?rankingsDataSlide?.img?.link+"3M.jpg" //maxWidth: 767
            :isDesktop?rankingsDataSlide?.img?.link+"3.jpg" //minWidth: 1024
            :rankingsDataSlide?.img?.link+"3T.jpg"} 
          alt={rankingsDataSlide?.location?.name} 
        />
        <div className="swiperText01">
            <strong>{rankingsDataSlide?.location?.name}
              <br/>
              <span>{rankingsDataSlide?.location?.english}</span>
            </strong>
            <p className="swiperP01">{rankingsDataSlide?.description?.slide}</p>
        </div>
    </div>
  )
}

export default BannerComponent