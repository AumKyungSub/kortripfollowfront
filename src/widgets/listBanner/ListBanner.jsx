import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

//Page Css
import './ListBanner.style.css'

const ListBanner = ({title, count, type = "theme", selected, images = []}) => {

  const {t} = useLanguage();

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


  return (
    <div 
      className="listBannerWrapper" 
      style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : { backgroundImage: 'url(/images/emptyBanner.jpg)' }}
    >
      <div className="listBannerTextWholeCover">
        <div className="listBannerTextCover">
          <h1 className="listBannerTextTitle">
            {title}
          </h1>
          <p className='listBannerTextCount'>
            {count}
          </p>
          <p className="listBannerTextContent">
            {t(`listPage.listBanner.content.${selected}`)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ListBanner