import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Components
import HomeCategoryComponent from './component/HomeCategoryComponent'

// Page css
import './HomeCategory.style.css'

const HomeCategory = () => {
    const {t} = useLanguage();
    
    return (
        <section className="homeCategoryBackground contentTopBottomSpacing">
            <div className="homeCategoryWrapper contentWidth">
                <div className="homeCategoryCardCover">
                    <HomeCategoryComponent imgName="mapIcon.png" name={t("homepage.homeCategory.region")} path="/region"/>
                    <HomeCategoryComponent imgName="seasonsIcon.png" name={t("homepage.homeCategory.season")} path="/season"/>
                    <HomeCategoryComponent imgName="etcIcon.png" name={t("homepage.homeCategory.theme")} link="CAFE" path="/theme"/>
                    <HomeCategoryComponent imgName="collectionIcon.png" name={t("homepage.homeCategory.collection")} path="/collection"/>
                </div>
            </div>  
        </section>  
    )
}

export default HomeCategory