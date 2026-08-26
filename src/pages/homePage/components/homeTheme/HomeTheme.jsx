import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Component
import HomeThemeComponent from './component/HomeThemeComponent'

// Page css
import './HomeTheme.style.css'


const HomeTheme = () => {
  // Language 사용
  const {t} = useLanguage();

  return (
    <section className='homeThemeBackground contentTopBottomSpacing'>
        <div className="homeThemeWrapper contentWidth">
          <div className="titleCover">
          <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {t('preTitle.homeTheme')}
          </p>
          <h2 className='title28px40px700'>
            {t("title.homeTheme")}
          </h2>
          </div>
          <HomeThemeComponent img={"cafe"} homeThemeP={t("homepage.homeTheme.cafeP")} homeThemePSnd={t("homepage.homeTheme.cafeName")} themeCode={"CAFE"} />
          <HomeThemeComponent img={"restaurant"} homeThemeP={t("homepage.homeTheme.restP")} homeThemePSnd={t("homepage.homeTheme.restName")} themeCode={"RESTAURANT"} />
          <HomeThemeComponent img={"lodging"} homeThemeP={t("homepage.homeTheme.lodgingP")} homeThemePSnd={t("homepage.homeTheme.lodgingName")} themeCode={"LODGING"} />
          <HomeThemeComponent img={"food"} homeThemeP={t("homepage.homeTheme.foodP")} homeThemePSnd={t("homepage.homeTheme.foodName")} themeCode={"FOOD"} />
          <HomeThemeComponent img={"market"} homeThemeP={t("homepage.homeTheme.marketP")} homeThemePSnd={t("homepage.homeTheme.marketName")} themeCode={"MARKET"} />
          <HomeThemeComponent img={"park"} homeThemeP={t("homepage.homeTheme.parkP")} homeThemePSnd={t("homepage.homeTheme.parkName")} themeCode={"PARK"} />
          <HomeThemeComponent img={"ocean"} homeThemeP={t("homepage.homeTheme.oceanP")} homeThemePSnd={t("homepage.homeTheme.oceanName")} themeCode={"OCEAN"} />
          <HomeThemeComponent img={"drive"} homeThemeP={t("homepage.homeTheme.driveP")} homeThemePSnd={t("homepage.homeTheme.driveName")} themeCode={"DRIVE"} />
        </div>
    </section>
  )
}

export default HomeTheme
