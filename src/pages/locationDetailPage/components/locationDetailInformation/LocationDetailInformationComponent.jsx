import React from 'react'

const LocationDetailInformationComponent = ({ icon, title, value }) => {
  return (
        <div className="locationDetailInformationCover">
            <div className="locationDetailInformationTitleCover">
                <img src={icon} alt={title} />
                <h4 className="locationDetailInformationTitle">{title}</h4>
            </div>
            <p className="locationDetailInformationText">{value}</p>
        </div>
  )
}

export default LocationDetailInformationComponent