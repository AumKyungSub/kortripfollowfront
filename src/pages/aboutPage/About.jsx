import React from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'

// Page css
import './About.style.css'

const About = () => {
  const {
    isFullMobile /*maxWidth: 767*/
  } = useResponsive();
  const {t} = useTranslation();

  const goToInstagram = () => {
        window.open("https://www.instagram.com/kayaum_photo/", "_blank", "noopener,noreferrer");
  }

  const goToBlog = () => {
        window.open("https://blog.naver.com/tripinsouthkorea", "_blank", "noopener,noreferrer");
  }

  const goToYoutube = () => {
        window.open("https://www.youtube.com/@%EA%B5%AD%ED%8A%B8%EB%94%B0%EB%9D%BC", "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Header/>
      {!isFullMobile && <EmptyHeader/>}
      <div className='aboutCover'>
        <div className="aboutTextCover">
          <h1 className="aboutTitle">{t("about.title")}</h1>
          <p className="aboutSlogan">
            {t("about.slogan")}
          </p>
          <p className="aboutDescription">
            {t("about.des")}
          </p>
          <div className="aboutLinkImgCover">
            <img src="/images/icon/instaIcon.png" alt="instagram" onClick={goToInstagram} />
            <img src="/images/icon/blogIcon.png" alt="instagram" onClick={goToBlog} />
            <img src="/images/icon/youtube.jpg" alt="instagram" onClick={goToYoutube} />
          </div>
        </div>
      </div>
    </>
  )
}

export default About
