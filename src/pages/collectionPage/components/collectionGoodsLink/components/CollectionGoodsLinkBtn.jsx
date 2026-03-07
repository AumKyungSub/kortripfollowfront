import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './CollectionGoodsLinkBtn.style.css'

const CollectionGoodsLinkBtn = ({ link, text }) => {
    const { t } = useTranslation();
    return (
        <span
            onClick={() => link()}
            className="collectionGoodsLink"
            style={{ cursor: "pointer" }}
        >
            <h4>
                {text}
            </h4>
        </span>
    )
}

export default CollectionGoodsLinkBtn