import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import SeasonsComponent from './SeasonsComponent'

// Page CSS
import './Seasons.style.css'

const Seasons = () => {
  const {t} = useTranslation();

  return (
    <div>
      <section className="seasons">
        <div className="cards">
          <SeasonsComponent imgName="mapIcon.png" name={t("homepage.seasons.region")} path="/region"/>
          <SeasonsComponent imgName="seasonsIcon.png" name={t("homepage.seasons.season")} path="/season"/>
          <SeasonsComponent imgName="etcIcon.png" name={t("homepage.seasons.theme")} link="CAFE" path="/theme"/>
        </div>
      </section>      
    </div>
  )
}

export default Seasons
