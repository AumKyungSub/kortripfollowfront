import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Page CSS
import './AboutMe.style.css'

const AboutMe = ({isFullMobile}) => {

    const {t} = useTranslation();

  return (
    <div className="aboutMeWrapper">
        {!isFullMobile &&
            <div className="aboutMeImg"></div>
        }
        <div className="aboutMeText">
            <div className="aboutMeText">
                <p className="aboutMeTextSmallTitle">
                    <span className="aboutMeTextSmallTitleLine"></span> 
                    {t("about.aboutMe.meSmallTitle")}
                    {isFullMobile && 
                        <span className="aboutMeTextSmallTitleLine"></span> 
                    }
                </p>
                {isFullMobile &&
                    <div className="aboutMeImg"></div>
                }
                <h3 className='aboutMeTitle'>
                    {t("about.aboutMe.meTitle")}
                </h3>
                <p className='aboutMeTextContent'>
                    {t("about.aboutMe.meContent")}
                </p>
            </div>

        </div>
    </div>
  )
}

export default AboutMe