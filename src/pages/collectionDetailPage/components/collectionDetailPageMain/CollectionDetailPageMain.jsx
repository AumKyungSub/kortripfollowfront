import React from 'react'


// Page css
import './CollectionDetailPageMain.style.css'

const CollectionDetailPageMain = ({collection,isFullMobile}) => {
  return (
    <section className='collectionDetailPageMainWrapper'>
        {!isFullMobile &&
        <div className="collectionDetailPageImgCover">
            <img src={`${collection.img}1.jpg`} alt={collection.title} />
        </div>
        }
        <div className="collectionDetailPageTextCover">
            <h1>{collection.title}</h1>
            <div className="collectionDetailPageTagCover">
                {collection.tag?.map((tagItem, index) => (
                    <p key={index}>{tagItem}</p>
                ))}
            </div>
            <p>{collection.content}</p>
        </div>
        {isFullMobile &&
        <div className="collectionDetailPageImgCover">
            <img src={`${collection.img}1.jpg`} alt={collection.title} />
        </div>
        }
    </section>
  )
}

export default CollectionDetailPageMain