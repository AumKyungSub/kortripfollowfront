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
              <img src={regionList?.img?.link+"3R.jpg"} alt={regionList?.img?.link+"3R.jpg"} />
          </div>
          <div className="regionTextCover">
              <p className="regionName">
                <img src="/images/icon/regionIcon.png" alt="region" />
                {regionList?.location?.region?.[0]}</p>
              <h3 className="regionLocation">{regionList?.location?.name}</h3>
              <p className="regionText">{regionList?.description?.title}</p>
          </div>
      </div>
    </>
  )
}

export default RegionList
