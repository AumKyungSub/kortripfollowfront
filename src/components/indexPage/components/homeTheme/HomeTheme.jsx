import React from 'react'

import { useTranslation } from 'react-i18next'

// Component
import HomeThemeComponent from './HomeThemeComponent'

// Page css
import './HomeTheme.style.css'


const HomeTheme = () => {

  const {t} = useTranslation();

  return (
    <div className='homeTheme'>
        <section className="homeThemeWholeCover">
            <h2 className='homeThemeH2'>{t("homepage.homeTheme.title")}</h2>
            <HomeThemeComponent img={"cafe"} homeThemeP={t("homepage.homeTheme.cafeP")} homeThemePSnd={t("homepage.homeTheme.cafeName")} themeCode={"CAFE"} />
            <HomeThemeComponent img={"restaurant"} homeThemeP={t("homepage.homeTheme.restP")} homeThemePSnd={t("homepage.homeTheme.restName")} themeCode={"RESTAURANT"} />
            <HomeThemeComponent img={"lodging"} homeThemeP={t("homepage.homeTheme.lodgingP")} homeThemePSnd={t("homepage.homeTheme.lodgingName")} themeCode={"LODGING"} />
            <HomeThemeComponent img={"food"} homeThemeP={t("homepage.homeTheme.foodP")} homeThemePSnd={t("homepage.homeTheme.foodName")} themeCode={"FOOD"} />
        </section>
    </div>
  )
}

export default HomeTheme
