import React from 'react'

import { useTranslation } from 'react-i18next'

// Components
import Header from '../Header/Header'

// Page css
import './About.style.css'

const About = () => {
  const {t} = useTranslation();

  const goToInstagram = () => {
        window.open("https://www.instagram.com/kayaum_photo/", "_blank", "noopener,noreferrer");
  }

  const goToBlog = () => {
        window.open("https://blog.naver.com/tripinsouthkorea", "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <Header/>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default About
