import React from 'react'

// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import Header from '@/widgets/header/Header'
import AboutBanner from './components/aboutBanner/AboutBanner'
import AboutStory from './components/aboutStory/AboutStory'
import AboutValue from './components/aboutValue/AboutValue'
import AboutMe from './components/aboutMe/AboutMe'
import Footer from '../../widgets/footer/Footer'
import EmptyFooter from '../../widgets/emptyHeader/EmptyFooter'

// Page css
import './About.style.css'

const About = () => {
  const {
    isFullMobile, /*maxWidth: 767*/
    isDesktop
  } = useResponsive();
  
  // Transition Language
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const {t} = useTranslation();

  const goToInstagram = () => {
        window.open("https://www.instagram.com/kayaum_photo/", "_blank", "noopener,noreferrer");
  }

  const goToBlog = () => {
        window.open("https://blog.naver.com/tripinsouthkorea", "_blank", "noopener,noreferrer");
  }

  const goToYoutube = () => {
        window.open("https://www.youtube.com/@%EA%B5%AD%ED%8A%B8%EB%94%B0%EB%9D%BCKortrip", "_blank", "noopener,noreferrer");
  }

  return (
    <article>
      <Header/>
      <AboutBanner lang={lang} />
      <AboutStory isFullMobile={isFullMobile} lang={lang} />
      <AboutValue lang={lang} />
      <AboutMe isFullMobile={isFullMobile} lang={lang} />
      {isFullMobile && <EmptyFooter />}
      <Footer />
    </article>
  )
}

export default About
