import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page CSS
import './AboutMe.style.css'

const AboutMe = () => {
    // Device Size 사용
    const {isFullMobile} = useResponsive();
    // Language 사용
    const {t} = useLanguage();

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