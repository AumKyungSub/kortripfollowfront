import React from 'react'

const TopfiveComponentPc = ({rankingClickList, onSelect, isSelected}) => {
  return (
    <div
      className={`card ${isSelected ? "selected" : ""}`}// 선택되면 클래스명 selected 추가
      onClick={onSelect} //정보 onSelect에 담기
    >
        <img src={rankingClickList?.img?.link+"2.jpg"} alt={rankingClickList?.img?.link+"2.jpg"} />
        <p>{rankingClickList?.top}</p>
    </div>
  )
}

export default TopfiveComponentPc
