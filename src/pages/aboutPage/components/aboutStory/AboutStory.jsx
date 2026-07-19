import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Page CSS
import './AboutStory.style.css'

const AboutStory = ({isFullMobile, lang}) => {

    const {t} = useTranslation();

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