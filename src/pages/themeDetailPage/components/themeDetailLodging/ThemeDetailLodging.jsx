import React, {useState, useRef} from 'react'

import { useTranslation } from 'react-i18next';

//Page css
import './ThemeDetailLodging.style.css'

const ThemeDetailLodging = ({data, isFullMobile, lang}) => {

    const {t} = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    const scrollLeft = scrollRef.current.scrollLeft;
    const gap = 10;
    const cardWidth = scrollRef.current.children[0].offsetWidth + gap;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(index);
  };
  
  return (
    <>
        {/* 숙소 기본 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{data?.description?.type?.[lang]} {t("themeDetail.tDCI.tDCIHInfo")}</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{data?.description?.type?.[lang]} {t("themeDetail.tDCI.tDCIHInfo")}</h1>}
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkIn" />
                    <span className="title">{t("themeDetail.tDL.tDLCeckIn")}</span>
                    <span className="value">{data?.info?.checkIn}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkOut" />
                    <span className="title">{t("themeDetail.tDL.tDLCeckOut")}</span>
                    <span className="value">{data?.info?.checkOut}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/infoIcon.png" alt="info" />
                    <span className="title">{t("themeDetail.tDCI.tDCIHAmenities")}</span>
                    <span className="value">{data?.info?.facility?.[lang].join(", ")}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/cancelIcon.png" alt="noProvided" />
                    <span className="title">{t("themeDetail.tDL.tDLNP")}</span>
                    <span className="value">{data?.info?.noProvided?.[lang].join(", ")}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/parkingsIcon.png" alt="parking" />
                    <span className="title">{t("themeDetail.tDL.tDLParking")}</span>
                    <span className="value">{data?.info?.parking?t("themeDetail.tDL.tDLFree"):t("themeDetail.tDL.tDLNoParking")}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/travelIcon.png" alt="travel" />
                    <span className="title">{t("themeDetail.tDL.tDLSights")}</span>
                    <span className="value">{data?.info?.nearby?.[lang]}</span>
                </div>
            </div>
        </section>
        {/* 숙소 객실 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{t("themeDetail.tDL.tDLRooms.tDLRoomsRoom")} {t("themeDetail.tDL.tDLCheckPrice")}</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{t("themeDetail.tDL.tDLRooms.tDLRoomsRoom")} {t("themeDetail.tDL.tDLCheckPrice")}</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    {isFullMobile && 
                        <h2 className="themeDetailRoomInfoListTitle">
                            {data?.rooms[currentIndex]?.category?.[lang]}
                        </h2>
                    }
                    <div 
                        className="themeDetailRoomInfoList"
                        ref={scrollRef} 
                        onScroll={handleScroll}
                    >
                        {data?.rooms?.map((rooms, idx) => (
                            <div className="roomCard" key={idx}>
                                <h3>{!isFullMobile && rooms.category?.[lang]} {rooms.type?.[lang]}</h3>
                                <div className="roomCardInfo">
                                    <p><span>{t("themeDetail.tDL.tDLRooms.tDLRoomsBed")}</span>{isFullMobile && ":"} {rooms.bed?.[lang]}</p>
                                    <p><span>{t("themeDetail.tDL.tDLRooms.tDLRoomsMax")}</span>{isFullMobile && ":"} {rooms.capacity}{t("themeDetail.tDL.tDLRooms.tDLRoomsPerson")}</p>
                                    <p><span>{t("themeDetail.tDL.tDLRooms.tDLRoomsViewTitle")}</span>{isFullMobile && ":"} {rooms.view?.[lang].join(` ${t("themeDetail.tDL.tDLRooms.tDLRoomsView")}, `)} {t("themeDetail.tDL.tDLRooms.tDLRoomsView")}</p>
                                    <p><span>{t("themeDetail.tDL.tDLRooms.tDLRoomsCountTitle")}</span>{isFullMobile && ":"} {rooms.count}{t("themeDetail.tDL.tDLRooms.tDLRoomsCount")}</p>
                                    <p><span>{t("themeDetail.tDL.tDLRooms.tDLRoomsSize")}</span>{isFullMobile && ":"} {rooms.size}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        {/* 숙소 식당 및 카페 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{data?.description?.type?.[lang]} {t("themeDetail.tDL.tDLRestaurant.tDLRestaurantRes")}</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{data?.description?.type?.[lang]} {t("themeDetail.tDL.tDLRestaurant.tDLRestaurantRes")}</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.restaurants?.map((restaurants, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <h3>{restaurants.name?.[lang]}</h3>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>{restaurants.type?.[lang]} | {restaurants?.businessHour[0]?.title?.[lang]} {restaurants?.businessHour[0]?.time}({restaurants?.businessHour[0]?.season?.[lang]}) | {restaurants.location} | {restaurants.seats} {t("themeDetail.tDL.tDLRestaurant.tDLRestaurantSeats")}</p>
                                    <p></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        {/* 숙소 부대시설 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{t("themeDetail.tDL.tDLFacility.tDLFacilityFac")}</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{t("themeDetail.tDL.tDLFacility.tDLFacilityFac")}</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.facilities?.map((facilities, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <h3>{facilities?.name?.[lang]}</h3>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>{facilities?.businessHour?.[lang]} | {facilities?.location}</p>
                                    <p>{facilities?.breakTime?.[lang] && `${t("themeDetail.tDL.tDLFacility.tDLFacilityBT")}: ${facilities.breakTime?.[lang]}`}</p>
                                    <p></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      {isFullMobile && <div className='emptyLine'></div>}
    </>
  )
}

export default ThemeDetailLodging