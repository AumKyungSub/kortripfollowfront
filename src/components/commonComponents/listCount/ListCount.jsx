import React from 'react'

//Page Css
import './ListCount.style.css'

const ListCount = ({title, count,countM, isFullMobile}) => {
  return (
    <div className="listTitleCover">
      <h3>{title}</h3>
      {!isFullMobile ? (
        <p>{count}곳 입니다.</p>
      ) : (
        <p>총 {countM}곳</p>
      )}
    </div>
  )
}

export default ListCount