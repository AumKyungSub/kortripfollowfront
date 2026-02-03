import React from 'react'

import { useTranslation } from 'react-i18next';

//Page Css
import './ListBanner.style.css'

const ListBanner = ({type = "theme", images = []}) => {

  const {t} = useTranslation();

  // theme 배너 랜덤 이미지 선택
  const getRandomThemeImage = () => {

    return `/images/theme/themeBanner1${t("language.shortWord")}.jpg`;
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