import React from 'react'

// (hook) Navigate
import { useNavigate } from 'react-router-dom'
//(hook) Translation
import { useTranslation } from 'react-i18next'
// (hook) Read DB
import { useCollectionList } from '@/shared/hooks/useCollectionList'

// Page css
import './CollectionList.style.css'

const CollectionList = ({collections,lang}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();


  const goToCollectionDetail = (id) => {
    navigate(`/collection/${id}`);
  };

  return (
    <section className="collectionListWrapper">
      {collections.map((item) => (
        <div className="collectionListCard" key={item.id}>
          <div
            className="collectionListCardImgCover"
            style={{
              backgroundImage: `url('${item.img}.jpg')`
            }}
          />

          <div className="collectionListCardTextCover">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <p className="collectionListCardCamera subFont">
              {item.camera}
            </p>

            <span
              onClick={() => goToCollectionDetail(item.id)}
              className="collectionListCardLink"
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