import React from 'react'


// Page css
import './CollectionDetailPageMain.style.css'

const CollectionDetailPageMain = ({ collection }) => {
    return (
        <section className='collectionDetailPageMainWrapper'>
            <div className="collectionDetailPageImgCover">
                <img src={`${collection.img}1.jpg`} alt={collection.title} />
            </div>

            <div className="collectionDetailPageTextCover">
                <h1>{collection.title}</h1>
                <div className="collectionDetailPageTagCover">
                    {collection.tag?.map((tagItem, index) => (
                        <p key={index}>{tagItem}</p>
                    ))}
                </div>
                <p>{collection.content}</p>
            </div>
        </section>
    )
}

export default CollectionDetailPageMain