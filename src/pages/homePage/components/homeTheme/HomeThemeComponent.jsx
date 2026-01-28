import React from 'react'

import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next';

const HomeThemeComponent = ({homeThemeP, homeThemePSnd, img, themeCode, isFullMobile}) => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const goToTheme = () => {
        navigate('/theme', { state: { selectedTheme: themeCode } });
    }

    return (
        <div 
            className="homeThemeCover" 
            onClick={goToTheme} 
            style={{backgroundImage: `url(images/theme/${img}.jpg)`}}
        >
            {!isFullMobile ?
            <>
                <p className='homeThemeP'>{homeThemeP}</p>
                <p className='homeThemeP homeThemePSnd'>
                    {lang === "ko"
                        ? `추천 ${homeThemePSnd} 보러가기`
                        : `Explore Recommended ${homeThemePSnd}`
                    }
                    <img src="/images/icon/rightIcon.png" alt="rightIcon" />
                </p>
            </> 
            :
            <>
                <p className='homeThemeP'>#{homeThemePSnd}</p>
                <p className='homeThemePSmall'>{homeThemeP}</p>
            </>
            }
        </div>
    )
}

export default HomeThemeComponent
