import React from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';

// Page css
import './DetailMap.style.css'

const DetailMap = ({data, showParkingInfo/*true = location detail*/}) => {
    const {isFullMobile} = useResponsive();
    const { lang, t } = useLanguage()
    useKakaoLoader()

    /*-------------*/
    const latLng = data?.location?.latLng;    
    const parkingLatLng = data?.parking?.latLng;    
    const parkingLevel = data?.parking?.level;
    const name = data.location?.name?.[lang];    
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

    const center = hasParking
        ? { lat: (lat + latP) / 2, lng: (lng + lngP) / 2 }
        : { lat, lng }

    /*
        각 언어별 지도 주소
    */
    const englishName = data?.location?.name?.en;
    const englishAddress =
        data?.location?.address?.en?.[1] ??
        data?.location?.address?.en?.[0];
    const googleMapQuery = [englishName, englishAddress]
        .filter(Boolean)
        .join(', ');
    const englishParkingAddress = data?.parking?.address?.en;
    const googleParkingDestination = englishParkingAddress || `${latP},${lngP}`;
    const kakaoDestinationName = encodeURIComponent(name || '목적지');
    const kakaoParkingName = encodeURIComponent(
        `${name || '목적지'} ${t("locationPage.parking.parkingArea")}`
    );
    const mapLinkByLanguage = {
        ko:`https://map.kakao.com/link/to/${kakaoDestinationName},${lat},${lng}`,
        en: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapQuery)}`
    }  
    const mapLink = mapLinkByLanguage[lang] ?? mapLinkByLanguage.ko;
    const parkingLinkByLanguage = {
        ko: hasParking
                ? `https://map.kakao.com/link/to/${kakaoParkingName},${latP},${lngP}`
                : null,
        en: hasParking
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(englishParkingAddress)}`
                : null
    }  
    const parkingLink = parkingLinkByLanguage[lang] ?? parkingLinkByLanguage.ko;

    return (
        <>
        <section className="detailMapWrapper">
            <p className="preTitle14px600b54a2f">
                <span className="preTitle14px600b54a2fLine"></span>
                Info
            </p>
            <p className="title18px20px700">
                {t("detailPage.common.map.map")}
            </p>
            <div className="detailMapContainer">
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

                <div className="detailMapButtons">
                    <a 
                        href={mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={showParkingInfo ? "detailMapBtnHalf" : "detailMapBtnFull"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>
                        {t("detailPage.common.map.navigate")}
                    </a>

                    {hasParking && (
                        <a 
                            href={parkingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="detailMapBtnHalf"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>
                            {t("detailPage.common.map.navigateParking")}
                        </a>
                    )}
                </div>
            </div>

        </section>
        </>
    )
}

export default DetailMap
