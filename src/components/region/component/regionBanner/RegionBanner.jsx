import React from 'react'

// Page css
import './RegionBanner.style.css'

const RegionBanner = ({filteredList }) => {
  if (!filteredList || filteredList.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filteredList.length);
  const randomBanner = filteredList[randomIndex];

  
  return (
    <div className="regionBannerCover">
            <img
              src={randomBanner.imgName + "2.jpg"} alt={randomBanner.imgName + "2.jpg"}
            />

    </div>
  )
}

export default RegionBanner
