import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './CollectionBanner.style.css'

const CollectionBanner = () => {

    const {t} = useLanguage();

    return (
        <section className="collectionBannerWrapper bannerImg">
            <div className="collectionBannerTextCover">
                <span className='collectionBannerPreTitle'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fafaf8"  className="lucide lucide-aperture-icon lucide-aperture"><circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94"/><path d="M9.69 8h11.48"/><path d="m7.38 12 5.74-9.94"/><path d="M9.69 16 3.95 6.06"/><path d="M14.31 16H2.83"/><path d="m16.62 12-5.74 9.94"/></svg>
                    PHOTO COLLECTION
                </span>
                <h1 className='collectionBannerTextMain'>{t("collection.banner.main")}</h1>
                <div>
                    <p className='collectionBannerTextSubFst'>
                        {t("collection.banner.textFst")}
                    </p>
                    <p className='collectionBannerTextSubSnd'>
                        {t("collection.banner.textSnd")}
                    </p>
                </div>
            </div>
        </section>
    ) 
}

export default CollectionBanner