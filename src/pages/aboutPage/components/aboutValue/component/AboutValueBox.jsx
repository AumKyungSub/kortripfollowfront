import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

const AboutValueBox = (props) => {

    const {t} = useTranslation();

    return (
        <div className="aboutValueBox">
            <span className='aboutValueBoxImg'>
                <img src={`/images/about/icon/${props.img}.png`} alt={props.img} />
            </span>
            <h4>
                {t(`about.aboutValue.${props.title}`)}
            </h4>
            <p>
                {t(`about.aboutValue.${props.content}`)}
            </p>
        </div>
    )
}

export default AboutValueBox