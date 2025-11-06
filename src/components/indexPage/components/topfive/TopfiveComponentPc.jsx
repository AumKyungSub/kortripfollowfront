import React from 'react'

import { Link } from 'react-router-dom'

const TopfiveComponentPc = ({item, onSelect, isSelected}) => {
  return (
    <div
      className={`card ${isSelected ? "selected" : ""}`}// 선택되면 클래스명 selected 추가
      onClick={onSelect} //정보 onSelect에 담기
    >
        <img src={item?.imgName+"2.jpg"} alt={item?.imgName+"2.jpg"} />
        <p>{item?.top}</p>
    </div>
  )
}

export default TopfiveComponentPc
