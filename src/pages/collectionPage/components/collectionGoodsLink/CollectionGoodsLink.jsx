import React from 'react'

// Components
import CollectionGoodsLinkBtn from './components/CollectionGoodsLinkBtn'

import { useTranslation } from 'react-i18next'

// Page css
import './CollectionGoodsLink.style.css'

const CollectionGoodsLink = () => {
  const { t } = useTranslation();

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

  const goToPuzzleMoreRedbubble = () => {
    window.open(
      "https://www.redbubble.com/people/kayaum/explore?asc=u&page=1&sortOrder=recent",
      "_blank"
    );
  };

  return (
    <section className="collectoinGoodsLinkWrapper">
      <div className="collectionGoodsLinkCover">
        <CollectionGoodsLinkBtn link={goToPuzzleMorePuzzle} text={t('collection.banner.morePuzzle')} />
        <CollectionGoodsLinkBtn link={goToPuzzleMoreArt} text={t('collection.banner.moreMapple')} />
        <CollectionGoodsLinkBtn link={goToPuzzleMoreRedbubble} text={t('collection.banner.moreRedbubble')} />
      </div>
    </section>
  )
}

export default CollectionGoodsLink