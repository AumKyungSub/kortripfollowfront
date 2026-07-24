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
import './AboutStory.style.css'

const AboutStory = () => {
    // Device Size 사용
    const {isFullMobile} = useResponsive();
    // Language 사용
    const {t} = useLanguage();

    return (
        <div className="aboutStoryWrapper">
            <div className="aboutStoryText">
                        <p className="aboutStoryTextSmallTitle">
                            <span className="aboutStoryTextSmallTitleLine"></span> 
                            {t("about.aboutStory.storySmallTitle")}
                        </p>
                        <h3 className='aboutStoryTitle'>
                            {t("about.aboutStory.storyTitle")}
                        </h3>
                        <p className='aboutStoryTextContent'>
                            {t("about.aboutStory.storyText")}
                        </p>
            </div>
            {!isFullMobile &&
                <div className="aboutStoryImg"></div>
            }
        </div>
    )
}

export default AboutStory