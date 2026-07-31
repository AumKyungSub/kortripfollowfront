import React from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/


// Page css
import './CollectionDetailPageMain.style.css'

const CollectionDetailPageMain = ({ collection }) => {

    const {t, isEn} = useLanguage();

    return (
        <section className='collectionDetailPageMainWrapper'>
            <div className='collectionDetailPageMainCover'>
                <div className="collectionDetailPageImgCover">
                    <img src={`${collection.img}1.jpg`} alt={collection.title} />
                </div>
        
                <div className="collectionDetailPageTextCover">
                    <div className="collectionDetailPageTagCover">
                        <p>
                            {collection?.tag?.join(' · ')}
                        </p>
                    </div>
                    <h3 className='collectionDetailPageTitle'>{collection.title}</h3>
                    <p className='collectionDetailPageContent'>{collection.content}</p>
                    <div className="collectionDetailPageEtcCover">
                        <div className="collectionDetailPageEtcInfoCover">
                            <span className="collectionDetailPageEtcInfoLabel">
                                {t('collectionPage.detail.main.size')}
                            </span>
                            <span className="collectionDetailPageEtcInfoValue">
                                {collection?.size?.join(' x ')}
                            </span>
                        </div>
        
                        <div className="collectionDetailPageEtcInfoCover">
                            <span className="collectionDetailPageEtcInfoLabel">
                                {t('collectionPage.detail.main.sell')}
                            </span>
                            <span className="collectionDetailPageEtcInfoValue">
                                {collection?.sell}
                            </span>
                        </div>
        
                        <div className="collectionDetailPageEtcInfoCover">
                            <span className="collectionDetailPageEtcInfoLabel">
                                {t('collectionPage.detail.main.price')}
                            </span>
                            <span className="collectionDetailPageEtcInfoValue price">
                                {isEn ?
                                    `$${collection?.price} ~`
                                :
                                    `\u20A9${collection?.price} ~`
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CollectionDetailPageMain