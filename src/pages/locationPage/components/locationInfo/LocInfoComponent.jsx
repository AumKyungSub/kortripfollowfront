import React from 'react'

const LocInfoComponent = ({ icon, title, value }) => {
    return (
        <div className="locationInfoCover">
            <div className="infoTitle">
                <img src={icon} alt={title} />
                <p className="locInfoTitle">{title}</p>
            </div>
            <p className="locInfoText">{value}</p>
        </div>
    )
}

export default LocInfoComponent