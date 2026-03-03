import React from 'react'

const LocationDetailInformationComponent = ({ icon, title, value }) => {

    const isArray = Array.isArray(value);
    
    return (
        <div className="locationDetailInformationCover">
            <div className="locationDetailInformationTitleCover">
                <img src={icon} alt={title} />
                <h4 className="locationDetailInformationTitle">{title}</h4>
            </div>

            {isArray ? (
                value.map((item, idx) => {
                    if (item.type === "fee") {
                        return (
                            <div key={idx} className="feeMain locationDetailInformationTextCover">
                                <p className='locationDetailSubTypeTitle'>
                                    {item.title}
                                </p>
                                <p className='subFont locationDetailSubTypeText'>
                                    {item.exp}
                                </p>
                                <div key={idx} className="feeMain locationDetailInformationText">
                                    <p className='locationDetailSubTypeLabel'>
                                        {item.label}  
                                    </p>
                                    {item.label && <span className="dotLine" />}
                                    <p className='locationDetailSubTypeValue'>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        );
                    }

                    if (item.type === "sub") {
                        return (
                            <div key={idx} className="locationDetailInformationTextCover">
                                <p className='subFont locationDetailSubTypeText'>
                                    {item.text}
                                </p>
                            </div>
                        );
                    }

                    return null;
                })
            ) 
            : 
            (
                <p className="locationDetailInformationTextCover">{value}</p>
            )}
        </div>
    )
}

export default LocationDetailInformationComponent