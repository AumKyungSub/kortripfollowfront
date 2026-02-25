import React from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import HomeCategoryComponent from './HomeCategoryComponent'

// Page css
import './HomeCategory.style.css'

const HomeCategory = () => {
    const {t} = useTranslation();
    return (
        <section className="homeCategoryWrapper">
            <div className="homeCategoryCardCover">
                <HomeCategoryComponent imgName="mapIcon.png" name={t("homepage.homeCategory.region")} path="/region"/>
                <HomeCategoryComponent imgName="seasonsIcon.png" name={t("homepage.homeCategory.season")} path="/season"/>
                <HomeCategoryComponent imgName="etcIcon.png" name={t("homepage.homeCategory.theme")} link="CAFE" path="/theme"/>
                <HomeCategoryComponent imgName="collectionIcon.png" name={t("homepage.homeCategory.collection")} path="/collection"/>
            </div>
        </section>  
    )
}

export default HomeCategory