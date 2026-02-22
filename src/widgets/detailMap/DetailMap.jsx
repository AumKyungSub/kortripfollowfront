import React from 'react'

import { useTranslation } from 'react-i18next';

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './DetailMap.style.css'

const DetailMap = ({data, isFullMobile, lang, showParkingInfo/*true = location detail*/}) => {
    
    const { t } = useTranslation()
    useKakaoLoader()

    /*-------------*/
    const latLng = data?.location?.latLng;    
    const parkingLatLng = data?.parking?.latLng;    
    const parkingLevel = data?.parking?.level;
    const name = data.location?.name?.[lang];    
    const addressArray = data.location?.address?.[lang];
    /*-------------*/

    if (!latLng) return null

    const [lat, lng] = latLng.split(',').map(Number)

    const hasParking = parkingLatLng && showParkingInfo

    const [latP, lngP] = hasParking
        ? parkingLatLng.split(',').map(Number)
        : []

    const markerPositions = [
        { title: name, lat, lng },
        ...(hasParking
            ? [{
                title: t("locationPage.parking.markerRecommend"),
                lat: latP,
                lng: lngP
            }]
            : [])
    ]

    const separator = lang.startsWith('ko') ? ' ' : ', '
    const fullAddress = (addressArray || []).filter(Boolean).join(separator)

    const kakaoMainLink =
        `https://map.kakao.com/link/to/${name},${lat},${lng}`

    const kakaoParkingLink = hasParking
        ? `https://map.kakao.com/link/to/${name} ${t("locationPage.parking.parkingArea")},${latP},${lngP}`
        : null

    const center = hasParking
        ? { lat: (lat + latP) / 2, lng: (lng + lngP) / 2 }
        : { lat, lng }

    return (
        <>
        <section className="detailMapWrapper">

            {!isFullMobile && 
                <>
                    <h4 className='detailTitleMin768'>{t("locationPage.parking.title")}</h4>
                    <div className="emptyLine1px"></div>
                </>
            }

            <Map
                id="map"
                className={showParkingInfo ? "detailMapRectangle" : "detailMapSquare"}
                center={center}
                level={parkingLevel || 3}
            >
                {markerPositions.map((pos, i) => (
                    <React.Fragment key={i}>
                        <MapMarker position={{ lat: pos.lat, lng: pos.lng }} />
                
                        {showParkingInfo && (
                            <CustomOverlayMap position={{ lat: pos.lat, lng: pos.lng }}>
                                <div
                                    style={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '2px 6px',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {pos.title}
                                </div>
                            </CustomOverlayMap>
                        )}
                    </React.Fragment>
                ))}
            </Map>

            <div className="detailMapTextWrapper">
                {fullAddress && (
                    <div className="detailMapAddress subFont">
                        <img src="/images/icon/regionIcon.png" alt="region" />
                        <p>
                            {fullAddress}
                        </p>
                    </div>
                )}


                {showParkingInfo && (
                    <div className="detailMapParkingInfo">
                        <img src="/images/icon/parkingsIcon.png" alt="parkingsIcon" />
                        <p className='detailMapParkingFee'>
                            {data?.parking?.existence
                                ? `${data?.parking?.fee ? t("locationPage.parking.paid") 
                                : t("locationPage.parking.free")} ${t("locationPage.parking.parkingAvailable")}`
                                : t("locationPage.parking.parkingNotAvailable")
                            }
                        </p>
                    </div>
                )}
            </div>

            <div className="detailMapButtons">

                <a 
                    href={kakaoMainLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={showParkingInfo ? "detailMapBtnHalf" : "detailMapBtnFull"}
                >
                    <img src="/images/icon/mapIcon.png" alt="mapIcon" />
                    {t("locationPage.parking.navigation")}
                </a>

                {hasParking && (
                    <a 
                        href={kakaoParkingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={showParkingInfo ? "detailMapBtnHalf" : "detailMapBtnFull"}
                    >
                        <img src="/images/icon/mapIcon.png" alt="mapIcon" />
                        {t("locationPage.parking.recommendParking")}
                    </a>
                )}

            </div>
        </section>
        {isFullMobile && <div className="emptyLine"></div>}
        </>
    )
}

export default DetailMap