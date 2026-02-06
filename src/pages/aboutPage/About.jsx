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
      <article className='aboutWrapper'>
        <section className='aboutTopCover'>
          <p className="aboutDescription">
            {t("about.des")}
          </p>
        </section>
        <section className='aboutFstMiddleCover'>
            <img src="/images/logo/instaIcon.png" alt="Instagram" onClick={goToInstagram} />
            <img src="/images/logo/naverBlogIcon.png" alt="Naver Blog" onClick={goToBlog} />
            <img src="/images/logo/youtubeIcon.png" alt="Youtube" onClick={goToYoutube} />
        </section>
        <section className='aboutMiddleCover'>
          <p>{t("common.logoName")}</p>
          <h1 className="aboutMiddleTitle">{t("about.title")}</h1>
          <p>{t("common.myName")}</p>
        </section>
        <section className='aboutBottomCover'>

        </section>
      </article>
    </>
  )
}

export default About
