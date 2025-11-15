import React from 'react'

// Page css
import './RegionCount.style.css'

const RegionCount = ({selectedRegion, filteredList, isFullMobile}) => {
  return (
    <div className='regionListTitleCover'>
        <h3>{selectedRegion} 여행지</h3>
        {!isFullMobile? (
            <p>등록된 여행지가 총 {filteredList.length}곳입니다.</p>
        ):(
            <p>총 {filteredList.length}곳</p>
        )}
    </div>
  )
}

export default RegionCount
