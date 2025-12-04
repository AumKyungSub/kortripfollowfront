import React from 'react'

// Component
import HomeThemeComponent from './HomeThemeComponent'

// Page css
import './HomeTheme.style.css'

const HomeTheme = () => {
  return (
    <div className='homeTheme'>
        <section className="homeThemeWholeCover">
            <h2 className='homeThemeH2'>테마별</h2>
            <HomeThemeComponent img={"cafe"} homeThemeP={"여행 중 쉬어가는 시간"} homeThemePSnd={"카페"}/>
            <HomeThemeComponent img={"restaurant"} homeThemeP={"여행의 또 다른 묘미"} homeThemePSnd={"맛집"}/>
            <HomeThemeComponent img={"lodging"} homeThemeP={"즐거운 여행을 위한 충전"} homeThemePSnd={"숙소"}/>
            <HomeThemeComponent img={"food"} homeThemeP={"때로는 식사보다 더 중요한"} homeThemePSnd={"먹거리"}/>
        </section>
    </div>
  )
}

export default HomeTheme
