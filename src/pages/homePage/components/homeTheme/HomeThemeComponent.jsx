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
                <h3 className='homeThemeText'>{homeThemeP}</h3>
                <span className='homeThemeLinkCover'>
                    <h3 className='homeThemeText'>
                        {lang === "ko"
                            ? `추천 ${homeThemePSnd} 보러가기`
                            : `Explore Recommended ${homeThemePSnd}`
                        }
                    </h3>
                    <img src="/images/icon/rightIcon.png" alt="rightIcon" />
                </span>    
            </> 
            :
            <>
                <h3 className='homeThemeText'>#{homeThemePSnd}</h3>
                <p className='homeThemeText'>{homeThemeP}</p>
            </>
            }
        </div>
    )
}

export default HomeThemeComponent
