import React from 'react'

//(hook) Translation
import { useTranslation } from 'react-i18next'
// Page css
import './CollectionDetailPageLink.style.css'

const CollectionDetailPageLink = ({ collection }) => {
  const { t } = useTranslation();


  const goToPuzzlePuzzle = () => {
    window.open(collection.zazzle, "_blank");
  };

  const goToPuzzleFrame = () => {
    window.open(collection.mapple, "_blank");
  };

  return (
    <section className="collectionDetailPageLinkWrapper">
      <div className="collectionDetailPageLinkInner">
        <h3 className='collectionDetailPageLinkTitle'>
          {t("collection.banner.sellTitle")}
        </h3>
        <div className="collectionDetailPageCardCover">
          <div className="collectionDetailPageCard">
            <div className="collectionDetailPageCardImg">
              <img src={`${collection.img}2.jpg`} alt="{`${collection.img}2.jpg`}" className='collectionDetailPageCardImgHorizontal' />
            </div>
            <button className="clickBtnCover" style={{ width: "100%" }} onClick={() => goToPuzzlePuzzle()}>
              {t("collection.banner.keepPuzzle")}
            </button>
          </div>
          <div className="collectionDetailPageCard">
            <div className="collectionDetailPageCardImg">
              <img src={`${collection.img}3.jpg`} alt="{`${collection.img}2.jpg`}" className='collectionDetailPageCardImgHorizontal' />
            </div>
            <button className="clickBtnCover" style={{ width: "100%" }} onClick={() => goToPuzzleFrame()}>
              {t("collection.banner.keepFrame")}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionDetailPageLink