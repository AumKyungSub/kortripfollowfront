import React from 'react'

//(hook) Translation
import { useTranslation } from 'react-i18next'
// Page css
import './CollectionDetailPageLinkCard.style.css'

const CollectionDetailPageLinkCard = ({collection, itemData, keep, num, link, shopName}) => {
    const { t } = useTranslation();
// itemData에 이미 { url, title, price } 형태로 가공되어 들어옵니다.
  const productTitle = itemData?.title || '';
  const productPrice = itemData?.price || '';
    return (
        <>
                <div className="collectionDetailPageCard">
                    <div className="collectionDetailPageCardImg">
                        <img
                            src={`${collection.img}${shopName}${num}.jpg`}
                            alt={`${collection.img}${shopName}${num}.jpg`}
                            className='collectionDetailPageCardImgHorizontal'
                        />
                    </div>
                    <div className="collectionDetailPageCardBtnCover">
                        {(productTitle || productPrice) && (
                            <div className="collectionDetailPageCardInfo">
                                <p className="collectionDetailPageCardInfoName">
                                    {productTitle && <span className="productTitle">{productTitle}</span>}
                                </p>
                                <p className="collectionDetailPageCardInfoPrice">
                                    {productPrice && <span className="productPrice">{productPrice}</span>}
                                </p>
                            </div>
                        )}
                        <button className="clickBtnCover" style={{ width: "100%" }} onClick={() => link()}>
                            {t(`collection.banner.${keep}`)}
                        </button>
                    </div>
                </div>
        </>
    )
}

export default CollectionDetailPageLinkCard