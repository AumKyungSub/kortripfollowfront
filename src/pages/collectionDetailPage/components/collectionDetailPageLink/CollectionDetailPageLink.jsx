import React from 'react'

//(hook) Translation
import { useTranslation } from 'react-i18next'
// Page css
import './CollectionDetailPageLink.style.css'

const CollectionDetailPageLink = ({collection}) => {
  const {t} = useTranslation();


  const goToPuzzlePuzzle = () => {
    window.open(collection.zazzle, "_blank");
  };

  const goToPuzzleFrame = () => {
    window.open(collection.mapple, "_blank");
  };

  return (
    <section className="collectionDetailPageLinkWrapper">
        <h1>
          {t("collection.banner.sellTitle")}
        </h1>
        <div className="collectionDetailPageCardCover">
          <div className="collectionDetailPageCard">
            <div className="collectionDetailPageCardImg">
              <img src={`${collection.img}2.jpg`} alt="{`${collection.img}2.jpg`}" className='collectionDetailPageCardImgHorizontal'/>
            </div>
              <span
                onClick={() => goToPuzzlePuzzle()}
                className="collectionDetailPageCardLink"
                style={{ cursor: "pointer" }}
              >
                <h4>
                  {t("collection.banner.keepPuzzle")}
                </h4>
              </span>
          </div>
          <div className="collectionDetailPageCard">
            <div className="collectionDetailPageCardImg">
              <img src={`${collection.img}3.jpg`} alt="{`${collection.img}2.jpg`}" className='collectionDetailPageCardImgHorizontal' />
            </div>
              <span
                onClick={() => goToPuzzleFrame()}
                className="collectionDetailPageCardLink"
                style={{ cursor: "pointer" }}
              >
                <h4>
                  {t("collection.banner.keepFrame")}
                </h4>
              </span>
          </div>
        </div>
    </section>
  )
}

export default CollectionDetailPageLink