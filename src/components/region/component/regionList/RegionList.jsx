import React from 'react'
import { useNavigate } from 'react-router-dom'
// Page css
import './RegionList.style.css'

const RegionList = ({item}) => {

  const navigate = useNavigate();
  const locationDetail = () => {
    navigate(`/location/${item?.id}`)
  }

  return (
    <>
      <div className='regionListCover' onClick={locationDetail}>
          <div className="regionImgCover">
              <img src={item?.imgName+"3R.jpg"} alt={item?.imgName+"3R.jpg"} />
          </div>
          <div className="regionTextCover">
              <p className="regionName">
                <img src="/images/icon/regionIcon.png" alt="region" />
                {item?.region}</p>
              <h3 className="regionLocation">{item?.location}</h3>
              <p className="regionText">{item?.explainTitle}</p>
          </div>
      </div>
    </>
  )
}

export default RegionList
