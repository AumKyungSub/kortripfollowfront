import React from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Components
import CollectionGoodsLinkBtn from './components/CollectionGoodsLinkBtn'

// Page css
import './CollectionGoodsLink.style.css'

const CollectionGoodsLink = () => {
  const { t } = useLanguage();

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
          <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {t('preTitle.collectionBuy')}
              <span className="preTitle14px600b54a2fLine"></span>
          </p>
          <h2 className='title28px40px700'>
            {t("title.collectionBuy")}
          </h2>
          <p className='collectionGoodsLinkInfoShop'>
            {t('collection.goodsLink.infoShop')}
          </p>
          <div className="collectionGoodsLinkBtnCover">
            <CollectionGoodsLinkBtn platform="zazzle" link={goToPuzzleMorePuzzle} />
            <CollectionGoodsLinkBtn platform="mapple" link={goToPuzzleMoreArt} />
            <CollectionGoodsLinkBtn platform="redbubble" link={goToPuzzleMoreRedbubble} />
          </div>
      </div>
    </section>
  )
}

export default CollectionGoodsLink