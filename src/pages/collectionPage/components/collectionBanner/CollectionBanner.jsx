import React from 'react'

// (hook) Translation
import { useTranslation } from 'react-i18next'

// Page css
import './CollectionBanner.style.css'

const CollectionBanner = () => {

    const {t} = useTranslation();

    return (
        <section className="collectionBannerWrapper">
            <div className="collectionBannerTextCover">
                <h1>{t("collection.banner.title")}</h1>
                <div>
                    <p>
                        {t("collection.banner.textFst")}
                    </p>
                    <p className='subFont'>
                        {t("collection.banner.textSnd")}
                    </p>
                </div>
            </div>
        </section>
    ) 
}

export default CollectionBanner