import React from 'react'

import './ListBanner.style.css'

const ListBanner = ({type = "theme", images = [], themeRange = { min: 1, max: 2 }}) => {

  // theme 배너 랜덤 이미지 선택
  const getRandomThemeImage = () => {
    const rand = Math.floor(Math.random() * (themeRange.max - themeRange.min + 1)) + themeRange.min;
    return `/images/theme/themeBanner${rand}.jpg`;
  };

  // region 배너 랜덤 이미지 선택
  const getRandomRegionImage = () => {
    if (!images || images.length === 0) return null;
    const rand = Math.floor(Math.random() * images.length);
    return images[rand].img?.link + "2.jpg";
  };

  const imgSrc = type === "region" ? getRandomRegionImage() : getRandomThemeImage();

  if (!imgSrc) return null;

  return (
    <div className="listBannerCover">
      <img src={imgSrc} alt="Banner Img" />
    </div>
  )
}

export default ListBanner