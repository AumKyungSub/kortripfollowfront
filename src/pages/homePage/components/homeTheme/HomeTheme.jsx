import React from 'react'

import { useTranslation } from 'react-i18next'

// Component
import HomeThemeComponent from './HomeThemeComponent'

// Page css
import './HomeTheme.style.css'


const HomeTheme = ({isFullMobile}) => {

  const {t} = useTranslation();

  return (
    <div className='homeThemeBackground'>
        <section className="homeThemeWrapper">
            <h2>{t("homepage.homeTheme.title")}</h2>
            <HomeThemeComponent img={"cafe"} homeThemeP={t("homepage.homeTheme.cafeP")} homeThemePSnd={t("homepage.homeTheme.cafeName")} themeCode={"CAFE"} isFullMobile={isFullMobile}/>
            <HomeThemeComponent img={"restaurant"} homeThemeP={t("homepage.homeTheme.restP")} homeThemePSnd={t("homepage.homeTheme.restName")} themeCode={"RESTAURANT"} isFullMobile={isFullMobile} />
            <HomeThemeComponent img={"lodging"} homeThemeP={t("homepage.homeTheme.lodgingP")} homeThemePSnd={t("homepage.homeTheme.lodgingName")} themeCode={"LODGING"} isFullMobile={isFullMobile} />
            <HomeThemeComponent img={"food"} homeThemeP={t("homepage.homeTheme.foodP")} homeThemePSnd={t("homepage.homeTheme.foodName")} themeCode={"FOOD"} isFullMobile={isFullMobile} />
        </section>
    </div>
  )
}

export default HomeTheme
