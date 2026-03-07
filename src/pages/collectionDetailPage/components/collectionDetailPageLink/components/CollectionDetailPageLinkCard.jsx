import React from 'react'

//(hook) Translation
import { useTranslation } from 'react-i18next'
// Page css
import './CollectionDetailPageLinkCard.style.css'

const CollectionDetailPageLinkCard = ({ collection, category, keep, num, link }) => {
    const { t } = useTranslation();

    return (
        <>
            {category &&
                <div className="collectionDetailPageCard">
                    <div className="collectionDetailPageCardImg">
                        <img
                            src={`${collection.img}${num}.jpg`}
                            alt="{`${collection.img}${num}.jpg`}"
                            className='collectionDetailPageCardImgHorizontal'
                        />
                    </div>
                    <button className="clickBtnCover" style={{ width: "100%" }} onClick={() => link()}>
                        {t(`collection.banner.${keep}`)}
                    </button>
                </div>
            }
        </>
    )
}

export default CollectionDetailPageLinkCard