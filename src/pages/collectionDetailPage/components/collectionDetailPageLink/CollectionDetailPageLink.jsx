import React from 'react'
// components
import CollectionDetailPageLinkCard from './components/CollectionDetailPageLinkCard'
//(hook) Translation
import { useTranslation } from 'react-i18next'
// Page css
import './CollectionDetailPageLink.style.css'

const imgNumMap = { puzzle: 2, frame: 3, post: 4 };
const keepMap = { puzzle: "keepPuzzle", frame: "keepFrame", post: "keepPostcard" };

const CollectionDetailPageLink = ({ collection }) => {
  const { t } = useTranslation();

  const links = collection.links || {};

  const PlatformRow = ({ platformName, platformLinks, collection, shopName }) => {
    const rowRef = React.useRef(null);

    if (!platformLinks) return null;

    let normalizedLinks = platformLinks;
    if (typeof platformLinks === 'string') {
      normalizedLinks = { puzzle: platformLinks };
    }

    if (Object.keys(normalizedLinks).length === 0) return null;

    const handleScroll = (direction) => {
      if (rowRef.current) {
        const scrollAmount = 300; // adjust scroll distance
        if (direction === "left") {
          rowRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    return (
      <div className="collectionDetailPagePlatform">
        <h4 className="collectionDetailPagePlatformTitle">{platformName}</h4>
        <div className="collectionDetailPageCardRowWrapper">
          <button className="scrollBtn leftScroll" onClick={() => handleScroll('left')}>&#10094;</button>
          <div className="collectionDetailPageCardRow" ref={rowRef}>
            {Object.entries(normalizedLinks).map(([productType, url]) => (
              <CollectionDetailPageLinkCard
                key={productType}
                collection={collection}
                category={url}
                keep={keepMap[productType] || "keepPuzzle"}
                num={imgNumMap[productType] || 2}
                link={() => window.open(url, "_blank")}
                shopName={shopName}
              />
            ))}
          </div>
          <button className="scrollBtn rightScroll" onClick={() => handleScroll('right')}>&#10095;</button>
        </div>
      </div>
    );
  };

  return (
    <section className="collectionDetailPageLinkWrapper">
      <div className="collectionDetailPageLinkInner">
        <h3 className='collectionDetailPageLinkTitle'>
          {t("collection.banner.sellTitle")}
        </h3>
        <p className='subFont collectionDetailPageLinkSubTitle'>
          {t("collection.banner.sellSubTitle")}
        </p>
        <div className="collectionDetailPageCardCover">
          <PlatformRow platformName={t("collection.banner.zazzle")} platformLinks={collection.zazzle} collection={collection} shopName="zazzle" />
          <PlatformRow platformName={t("collection.banner.mapple")} platformLinks={collection.mapple} collection={collection} shopName="mapple" />
          <PlatformRow platformName={t("collection.banner.redbubble")} platformLinks={collection.redbubble} collection={collection} shopName="redbubble" />
        </div>
      </div>
    </section >
  )
}

export default CollectionDetailPageLink