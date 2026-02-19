import React from 'react'

import { useTranslation } from 'react-i18next'

//Page Css
import './ListCount.style.css'

const ListCount = ({title, count,countM, isFullMobile}) => {
  const {t} = useTranslation();
  return (
    <div className="listTitleCover">
      <h3>{title}</h3>
      {!isFullMobile ? (
        <p>{count}{t("listCount.listCountPc")}</p>
      ) : (
        <p className='subFont'>{t("listCount.listContTotal")} {countM}{t("listCount.listCountMobile")}</p>
      )}
    </div>
  )
}

export default ListCount