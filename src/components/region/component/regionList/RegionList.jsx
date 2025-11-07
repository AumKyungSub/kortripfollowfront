import React from 'react'
import { useNavigate } from 'react-router-dom'
// Page css
import './RegionList.style.css'

const RegionList = ({regionList}) => {

  const navigate = useNavigate();
  const locationDetail = () => {
    navigate(`/location/${regionList?.id}`)
  }

  return (
    <>
      <div className='regionListCover' onClick={locationDetail}>
          <div className="regionImgCover">
              <img src={regionList?.imgName+"3R.jpg"} alt={regionList?.imgName+"3R.jpg"} />
          </div>
          <div className="regionTextCover">
              <p className="regionName">
                <img src="/images/icon/regionIcon.png" alt="region" />
                {regionList?.region}</p>
              <h3 className="regionLocation">{regionList?.location}</h3>
              <p className="regionText">{regionList?.explainTitle}</p>
          </div>
      </div>
    </>
  )
}

export default RegionList
