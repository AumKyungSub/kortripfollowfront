import React from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Kakao Map API Import
import { Map, MapMarker, CustomOverlayMap, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk';
import { createMapDirectionsLink, hasDriveDirections } from '@/shared/lib/mapDirections';

// Page css
import './DetailMap.style.css'

const DetailMap = ({data, showParkingInfo/*true = location detail*/}) => {
    const { lang, t } = useLanguage()
    useKakaoLoader()

    /*-------------*/
    const latLng = data?.location?.latLng;    
    const parkingLatLng = data?.parking?.latLng;    
    const parkingLevel = data?.parking?.level;
    const name = data.location?.name?.[lang];    
    const driveRoute = data?.driveRoute;
    const isDriveRoute = hasDriveDirections(data);
    /*-------------*/

    if (!latLng) return null

    const [lat, lng] = latLng.split(',').map(Number)

    const hasParking = parkingLatLng && showParkingInfo

    const [latP, lngP] = hasParking
        ? parkingLatLng.split(',').map(Number)
        : []

    const driveMarkerPositions = isDriveRoute ? [
        {
            title: driveRoute.start?.name?.[lang] || driveRoute.start?.name?.ko || name,
            lat: Number(driveRoute.start.latitude),
            lng: Number(driveRoute.start.longitude)
        },
        {
            title: driveRoute.destination?.name?.[lang] || driveRoute.destination?.name?.ko || t("detailPage.common.map.destination", { defaultValue: "도착지" }),
            lat: Number(driveRoute.destination.latitude),
            lng: Number(driveRoute.destination.longitude)
        }
    ] : [];

    const markerPositions = isDriveRoute ? driveMarkerPositions : [
        { title: name, lat, lng },
        ...(hasParking
            ? [{
                title: t("locationPage.parking.markerRecommend"),
                lat: latP,
                lng: lngP
            }]
            : [])
    ]

    const drivePath = isDriveRoute
        ? (driveRoute.routePath || [])
            .map(point => ({ lat: Number(point.latitude), lng: Number(point.longitude) }))
            .filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        : [];

    const routeBoundsPoints = drivePath.length ? drivePath : driveMarkerPositions;
    const center = isDriveRoute && routeBoundsPoints.length
        ? {
            lat: routeBoundsPoints.reduce((sum, point) => sum + point.lat, 0) / routeBoundsPoints.length,
            lng: routeBoundsPoints.reduce((sum, point) => sum + point.lng, 0) / routeBoundsPoints.length
        }
        : hasParking
        ? { lat: (lat + latP) / 2, lng: (lng + lngP) / 2 }
        : { lat, lng }

    /*
        각 언어별 지도 주소
    */
    const englishParkingAddress = data?.parking?.address?.en;
    const kakaoParkingName = encodeURIComponent(
        `${name || '목적지'} ${t("locationPage.parking.parkingArea")}`
    );
    const mapLink = createMapDirectionsLink(data, lang);
    const parkingLinkByLanguage = {
        ko: hasParking
                ? `https://map.kakao.com/link/to/${kakaoParkingName},${latP},${lngP}`
                : null,
        en: hasParking
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(englishParkingAddress || `${latP},${lngP}`)}`
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
                    level={isDriveRoute ? 8 : (parkingLevel || 3)}
                    onCreate={map => {
                        if (!isDriveRoute || routeBoundsPoints.length < 2 || !window.kakao?.maps) return;
                        const bounds = new window.kakao.maps.LatLngBounds();
                        routeBoundsPoints.forEach(point => bounds.extend(new window.kakao.maps.LatLng(point.lat, point.lng)));
                        map.setBounds(bounds, 40, 40, 40, 40);
                    }}
                >
                    {drivePath.length >= 2 && <Polyline
                        path={drivePath}
                        strokeWeight={5}
                        strokeColor="#2f9f70"
                        strokeOpacity={0.9}
                        strokeStyle="solid"
                    />}
                    {markerPositions.map((pos, i) => (
                        <React.Fragment key={i}>
                            <MapMarker position={{ lat: pos.lat, lng: pos.lng }} />
                    
                            {(showParkingInfo || isDriveRoute) && (
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
            {isDriveRoute && <p className="detailMapAttribution">
                {lang === "en" ? "Route data" : "경로 데이터"} © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" rel="noopener noreferrer">ODbL</a><br />
                {lang === "en"
                    ? "The displayed route may differ from current road conditions and navigation guidance."
                    : "표시된 경로는 실제 도로 상황 및 내비게이션 안내와 다를 수 있습니다."}
            </p>}

        </section>
        </>
    )
}

export default DetailMap
