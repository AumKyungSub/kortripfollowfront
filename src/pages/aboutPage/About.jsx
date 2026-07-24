import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
/*------------------------/custom hooks-----------------------------------*/

// Components
import Header from '@/widgets/header/Header'
import AboutBanner from './components/aboutBanner/AboutBanner'
import AboutStory from './components/aboutStory/AboutStory'
import AboutValue from './components/aboutValue/AboutValue'
import AboutMe from './components/aboutMe/AboutMe'
import Footer from '@/widgets/footer/Footer'
import EmptyFooter from '@/widgets/emptyHeader/EmptyFooter'
import MobileNavigation from '@/widgets/mobileNavigation/MobileNavigation'

// Page css
import './About.style.css'

const About = () => {
  // Device Size 사용
  const {isFullMobile} = useResponsive();

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
      <AboutBanner />
      <AboutStory />
      <AboutValue />
      <AboutMe />
      <Footer />
      {isFullMobile && <EmptyFooter />}
      {isFullMobile && <MobileNavigation />}
    </article>
  )
}

export default About
