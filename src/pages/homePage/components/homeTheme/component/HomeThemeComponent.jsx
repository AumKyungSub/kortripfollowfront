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
            <>
                <h3 className='homeThemeTextTitle'>{homeThemeP}</h3>
                <span className='homeThemeLinkCover'>
                    <h3 className='homeThemeTextGoTo'>
                        {actionText}
                    </h3>
                    <button
                        className="homeThemeBtn"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </span>    
            </> 
            :
            <>
                <h3 className='homeThemeTextTitle'>#{homeThemePSnd}</h3>
                <p className='homeThemeTextGoTo'>{homeThemeP}</p>
            </>
            }
        </div>
    )
}

export default HomeThemeComponent
