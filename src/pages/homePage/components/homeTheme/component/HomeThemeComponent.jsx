import React from 'react'

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

const HomeThemeComponent = ({homeThemeP, homeThemePSnd, img, themeCode}) => {
    const navigate = useNavigate();

    // Device Size 사용
    const {isFullMobile} = useResponsive();
    // Language 사용
    const {isEn} = useLanguage();

    const goToTheme = () => {
        navigate('/theme', { state: { selectedTheme: themeCode } });
    }
    
    const actionText = isEn
    ? `Explore Recommended ${homeThemePSnd}`
    : `추천 ${homeThemePSnd} 보러가기`;

    return (
        <div 
            className="homeThemeCover" 
            onClick={goToTheme} 
            style={{backgroundImage: `url(images/theme/${img}.jpg)`}}
        >
            {!isFullMobile ?
            <div className='homeThemeTextCover'>
                <p className='homeThemeTextTitle'>{homeThemeP}</p>
                <span className='homeThemeLinkCover'>
                    <p className='homeThemeTextGoTo'>
                        {actionText}
                    </p>
                    <button
                        className="homeThemeBtn"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </span>    
            </div> 
            :
            <div className='homeThemeTextCover'>
                <h3 className='homeThemeTextTitle'>#{homeThemePSnd}</h3>
                <p className='homeThemeTextGoTo'>{homeThemeP}</p>
            </div>
            }
        </div>
    )
}

export default HomeThemeComponent
