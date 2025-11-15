import React from 'react'

import { useNavigate } from 'react-router-dom'

const HomeThemeComponent = ({homeThemeP, homeThemePSnd, img}) => {
    const navigate = useNavigate();

    const goToTheme = () => {
    navigate('/theme', { state: { selectedTheme: homeThemePSnd } });
    }

    return (
        <div className="homeThemeCover" onClick={goToTheme} style={{backgroundImage: `url(images/theme/${img}.jpg)`}}>
            <p className='homeThemeP'>{homeThemeP}</p>
            <p className='homeThemeP homeThemePSnd'>
                추천 {homeThemePSnd} 보러가기
                <img src="/images/icon/rightIcon.png" alt="rightIcon" />
            </p>
        </div>
    )
}

export default HomeThemeComponent
