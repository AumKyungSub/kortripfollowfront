import React from 'react'

/*------------------------hooks-----------------------------------*/
// (hook) Navigate
import { useNavigate } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './CollectionList.style.css'

const CollectionList = ({ collections }) => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();


  const goToCollectionDetail = (id) => {
    navigate(`/collection/${id}`);
  };

  return (
    <section className="collectionListWrapper">
      {collections.map((item) => (
        <div className="collectionListCard" key={item.id}>
          <div className="collectionListCardImgCover">

    {/* 이미지 */}
    <div
        className="collectionListCardImgMain"
        style={{ backgroundImage: `url('${item.img}.jpg')` }}
    />

    {/* 태그 */}
    <span className="collectionListCarImgTag">
        {item?.tag?.[1]}
    </span>

    {/* 텍스트 */}
    <div className="collectionListCardTextCover">
        <h4 className="collectionTitleText">{item.title}</h4>

        <p className="collectionListCardContent">
            {item.content}
        </p>

        <p className="collectionListCardCamera">
            {item.camera}
        </p>

        <span
            onClick={() => goToCollectionDetail(item.id)}
            className="collectionListCardLink"
        >
            {t("collection.banner.collectionDetailPageLink")}
        </span>
    </div>

</div>
        </div>
      ))}
    </section>
  )
}

export default CollectionList