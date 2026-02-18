import React from 'react'

import { useTranslation } from 'react-i18next'

// Component
import HomeSeasonComponent from './HomeSeasonComponent'

// Page css
import './HomeSeason.style.css'

const HomeSeason = ({rankingData = []}) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const seasonMap = {
        SPRING: { ko: "봄", en: "Spring" },
        SUMMER: { ko: "여름", en: "Summer" },
        FALL: { ko: "가을", en: "Fall" },
        WINTER: { ko: "겨울", en: "Winter" }
    };
    return (
        <>
            <section className='homeSeasonWrapper'>
                <h2>{lang === "ko" ? "계절별 여행지" : "Travel destinations by Season"}</h2>
                <div className="homeSeasonCover">
                    {Object.entries(seasonMap).map(([code, name]) => (
                        <HomeSeasonComponent
                            key={code}
                            img={code.toLowerCase()}    
                            seasons={name[lang]}     
                            seasonCode={code}          
                            rankingData={rankingData}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}

export default HomeSeason
