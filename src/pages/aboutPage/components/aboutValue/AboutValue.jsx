import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Component
import AboutValueBox from './component/AboutValueBox'

// Page CSS
import './AboutValue.style.css'

const AboutValue = () => {

    const {t} = useTranslation();

    return (
        <div className='aboutValueWrapper'>
            <div className="aboutValueCover">
                <p className="aboutValueSmallTitle aboutStoryTextSmallTitle">
                    <span className="aboutStoryTextSmallTitleLine"></span> 
                    {t("about.aboutValue.valueSmallTitle")}
                    <span className="aboutStoryTextSmallTitleLine"></span> 
                </p>
            </div>
            <h3 className='aboutValueTitle aboutStoryTitle'>
                {t("about.aboutValue.valueTitle")}
            </h3>
            <div className="aboutValueBoxCover">
                <AboutValueBox img="photo" title="valueContents1T" content="valueContents1C" />
                <AboutValueBox img="place" title="valueContents2T" content="valueContents2C" />
                <AboutValueBox img="review" title="valueContents3T" content="valueContents3C" />
                <AboutValueBox img="travel" title="valueContents4T" content="valueContents4C" />
            </div>
        </div>
    )
}

export default AboutValue