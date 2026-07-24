import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

const AboutValueBox = (props) => {
    // Language 사용
    const {t} = useLanguage();

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