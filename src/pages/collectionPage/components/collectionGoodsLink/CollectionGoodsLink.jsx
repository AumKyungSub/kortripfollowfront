import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './CollectionGoodsLink.style.css'

const CollectionGoodsLink = () => {
    const {t} = useTranslation();
    
    const goToPuzzleMorePuzzle = () => {
        window.open(
        "https://www.zazzle.com/store/kortripfollow/products",
        "_blank"
        );
    };

    const goToPuzzleMoreArt = () => {
        window.open(
        "https://marpple.shop/kr/kayaum_shop/products?cate_root_id=1",
        "_blank"
        );
    };

  return (
    <section className="collectoinGoodsLinkWrapper">
        <div className="collectionGoodsLinkCover">
              <span
                onClick={() => goToPuzzleMorePuzzle()}
                className="collectionGoodsLink"
                style={{ cursor: "pointer" }}
              >
                <h4>
                    {t('collection.banner.morePuzzle')}
                </h4>
            </span>
              <span
                onClick={() => goToPuzzleMoreArt()}
                className="collectionGoodsLink"
                style={{ cursor: "pointer" }}
              >
                <h4>
                    {t('collection.banner.moreArt')}
                </h4>
            </span>
        </div>
    </section>
  )
}

export default CollectionGoodsLink