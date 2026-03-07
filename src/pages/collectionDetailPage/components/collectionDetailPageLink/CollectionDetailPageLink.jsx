import React from 'react'
// components
import CollectionDetailPageLinkCard from './components/CollectionDetailPageLinkCard'
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

  const goToPuzzleRedbubble = () => {
    window.open(collection.redbubble, "_blank");
  };

  return (
    <section className="collectionDetailPageLinkWrapper">
      <div className="collectionDetailPageLinkInner">
        <h3 className='collectionDetailPageLinkTitle'>
          {t("collection.banner.sellTitle")}
        </h3>
        <div className="collectionDetailPageCardCover">
          <CollectionDetailPageLinkCard collection={collection} category={collection.zazzle} keep="keepPuzzle" num={2} link={goToPuzzlePuzzle} />
          <CollectionDetailPageLinkCard collection={collection} category={collection.redbubble} keep="keepPostcard" num={4} link={goToPuzzleRedbubble} />
          <CollectionDetailPageLinkCard collection={collection} category={collection.mapple} keep="keepFrame" num={3} link={goToPuzzleFrame} />
        </div>
      </div>
    </section>
  )
}

export default CollectionDetailPageLink