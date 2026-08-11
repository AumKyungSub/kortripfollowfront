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
      className="listBannerWrapper bannerImg" 
      style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : { backgroundImage: 'url(/images/emptyBanner.jpg)' }}
    >
      <div className="listBannerTextWholeCover">
        <div className="listBannerTextCover">
          <span className='listBannerTextCount'>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            <p>
              {`${count} ${t('listPage.listBanner.count')}`}
            </p>
          </span>
          <h1 className="listBannerTextTitle">
            {title}
          </h1>
          <p className="listBannerTextContent">
            {t(`listPage.listBanner.content.${selected}`)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ListBanner