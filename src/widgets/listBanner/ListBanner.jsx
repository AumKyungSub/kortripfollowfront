import React from 'react'

/*------------------------hooks-----------------------------------*/
import { useMediaQuery } from 'react-responsive';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive';
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

//Page Css
import './ListBanner.style.css'

const ListBanner = ({title, count, type = "theme", selected, images = []}) => {

  const {t, isKo} = useLanguage();
  const {isFullMobile, isDesktop} = useResponsive();
  const isBannerPc = useMediaQuery({ minWidth: 1280 });

  const getScreenSuffix = () => {
    if (isFullMobile) return "M";
    if (isBannerPc) return "D";
    if (isDesktop) return "SD";
    return "T";
  };

  // theme 배너 화면 크기와 언어별 고정 이미지 선택
  const getThemeImage = () => {
    const languageSuffix = isKo ? "Ko" : "En";
    if (isFullMobile) return `/images/theme/themeBannermobile${languageSuffix}.jpg`;
    if (isBannerPc) return `/images/theme/themeBannerpc${languageSuffix}.jpg`;
    if (isDesktop) return `/images/theme/themeBannersmpc${languageSuffix}.jpg`;
    return `/images/theme/themeBannertablet${languageSuffix}.jpg`;
  };

  // region 배너: 기존 rankings 장소 중 랜덤 이미지 선택
  const getRandomRegionImage = () => {
    const screenSuffix = getScreenSuffix();
    const availableImages = (images || [])
      .filter((item) => !["tourApi", "manual"].includes(item?.source))
      .flatMap((item) => item?.img?.link ? [`${item.img.link}2${screenSuffix}.jpg`] : []);
    if (!availableImages.length) return null;
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };

  const imgSrc = type === "region" ? getRandomRegionImage() : getThemeImage();


  return (
    <div 
      className="listBannerWrapper bannerImg" 
      style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : { backgroundImage: 'url(/images/emptyImage.jpg)' }}
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
