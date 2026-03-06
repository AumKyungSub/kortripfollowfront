import React from 'react'

// (hook) Navigate
import { useNavigate } from 'react-router-dom'
//(hook) Translation
import { useTranslation } from 'react-i18next'
// (hook) Read DB
import { useCollectionList } from '@/shared/hooks/useCollectionList'

// Page css
import './CollectionList.style.css'

const CollectionList = ({ collections, lang }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  const goToCollectionDetail = (id) => {
    navigate(`/collection/${id}`);
  };

  return (
    <section className="collectionListWrapper">
      {collections.map((item) => (
        <div className="collectionListCard" key={item.id}>
          <div className="collectionListCardImgCover">
            {/* Blurred Background */}
            <div
              className="collectionListCardImgBlur"
              style={{ backgroundImage: `url('${item.img}.jpg')` }}
            />
            {/* Main Foreground Image */}
            <div
              className="collectionListCardImgMain"
              style={{ backgroundImage: `url('${item.img}.jpg')` }}
            />
          </div>

          <div className="collectionListCardTextCover">
            <h4 className="collectionTitleText">{item.title}</h4>
            {/* Text description and camera are set to display:none in CSS */}
            <p className="collectionListCardCamera subFont">{item.camera}</p>

            <span
              onClick={() => goToCollectionDetail(item.id)}
              className="clickBtnCover collectionListCardLink"
              style={{ cursor: "pointer" }}
            >
              {t("collection.banner.collectionDetailPageLink")}
            </span>
          </div>
        </div>
      ))}
    </section>
  )
}

export default CollectionList