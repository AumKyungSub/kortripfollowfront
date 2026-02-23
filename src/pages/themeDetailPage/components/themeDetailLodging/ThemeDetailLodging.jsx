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
        <section className="themeDetailLodgingInfoWrapper">
            <h4 className='detailTitleMin768'>
                {data?.description?.type?.[lang]} {t("themeDetail.tDCI.tDCIHInfo")}
            </h4>
            {!isFullMobile && <div className='emptyLine1px'></div>}
            <div className="themeDetailBasicInfoCover">
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkIn" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDL.tDLCeckIn")}
                    </p>
                    <p>
                        {data?.info?.checkIn}
                    </p>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkOut" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDL.tDLCeckOut")}
                    </p>
                    <p>
                        {data?.info?.checkOut}
                    </p>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/infoIcon.png" alt="info" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDCI.tDCIHAmenities")}
                    </p>
                    <p>
                        {data?.info?.facility?.[lang].join(", ")}
                    </p>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/cancelIcon.png" alt="noProvided" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDL.tDLNP")}
                    </p>
                    <p>
                        {data?.info?.noProvided?.[lang].join(", ")}
                    </p>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/parkingsIcon.png" alt="parking" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDL.tDLParking")}
                    </p>
                    <p>
                        {data?.info?.parking?t("themeDetail.tDL.tDLFree"):t("themeDetail.tDL.tDLNoParking")}
                    </p>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/travelIcon.png" alt="travel" />
                    <p className='themeDetailBasicInfoTitle'>
                        {t("themeDetail.tDL.tDLSights")}
                    </p>
                    <p>
                        {data?.info?.nearby?.[lang]}
                    </p>
                </div>
            </div>
        </section>
        {isFullMobile && <div className='emptyLine'></div>}
        {/* 숙소 객실 정보 */}
        <section className="themeDetailLodgingInfoWrapper">
            <h4 className='detailTitleMin768'>
                {t("themeDetail.tDL.tDLRooms.tDLRoomsRoom")} {t("themeDetail.tDL.tDLCheckPrice")}
            </h4>
            {!isFullMobile && <div className='emptyLine1px'></div>}
            <div className="themeDetailRoomInfoCover">
                <div className="themeDetailRoomInfoSubCover">
                    <div 
                        className="themeDetailRoomInfoList"
                        ref={scrollRef} 
                        onScroll={handleScroll}
                    >
                        {data?.rooms?.map((rooms, idx) => (
                            <div className="roomCard" key={idx}>
                                <p className='themeDetailRoomInfoListTitle'>
                                    {rooms.category?.[lang]} {rooms.type?.[lang]}
                                </p>
                                <div className='emptyLine1px'></div>
                                <div className="roomCardInfo">
                                    <p className='subFont'>
                                        <span>
                                            {t("themeDetail.tDL.tDLRooms.tDLRoomsBed")}
                                        </span>
                                        {isFullMobile && ":"} {rooms.bed?.[lang]}
                                    </p>
                                    <p className='subFont'>
                                        <span>
                                            {t("themeDetail.tDL.tDLRooms.tDLRoomsMax")}
                                        </span>
                                        {isFullMobile && ":"} {rooms.capacity}{t("themeDetail.tDL.tDLRooms.tDLRoomsPerson")}
                                    </p>
                                    <p className='subFont'>
                                        <span>
                                            {t("themeDetail.tDL.tDLRooms.tDLRoomsViewTitle")}
                                        </span>
                                        {isFullMobile && ":"} {rooms.view?.[lang].join(` ${t("themeDetail.tDL.tDLRooms.tDLRoomsView")}, `)} {t("themeDetail.tDL.tDLRooms.tDLRoomsView")}
                                    </p>
                                    <p className='subFont'>
                                        <span>
                                            {t("themeDetail.tDL.tDLRooms.tDLRoomsCountTitle")}
                                        </span>
                                        {isFullMobile && ":"} {rooms.count}{t("themeDetail.tDL.tDLRooms.tDLRoomsCount")}
                                    </p>
                                    <p className='subFont'>
                                        <span>
                                            {t("themeDetail.tDL.tDLRooms.tDLRoomsSize")}
                                        </span>{isFullMobile && ":"} {rooms.size}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        {isFullMobile && <div className='emptyLine'></div>}
        {/* 숙소 식당 및 카페 정보 */}
        <section className="themeDetailLodgingInfoWrapper">
            <h4 className='detailTitleMin768'>
                {data?.description?.type?.[lang]} {t("themeDetail.tDL.tDLRestaurant.tDLRestaurantRes")}
            </h4>
            {!isFullMobile && <div className='emptyLine1px'></div>}
            <div className="themeDetailBasicInfoCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.restaurants?.map((restaurants, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <div className="themeDetailInfoTitleCover">
                                    <p className='themeDetailInfoTitle'>
                                        {restaurants.name?.[lang]} 
                                    </p>
                                    <p className='subFont'>
                                        ({restaurants.type?.[lang]} )
                                    </p>
                                </div>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>
                                        
                                    </p>
                                    <p>
                                        {restaurants?.businessHour[0]?.title?.[lang]} {restaurants?.businessHour[0]?.time}({restaurants?.businessHour[0]?.season?.[lang]}) 
                                    </p>
                                    <p>
                                        {restaurants.location} 
                                    </p>
                                    <p>
                                        {restaurants.seats} {t("themeDetail.tDL.tDLRestaurant.tDLRestaurantSeats")}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
        {isFullMobile && <div className='emptyLine'></div>}
        {/* 숙소 부대시설 정보 */}
        <section className="themeDetailLodgingInfoWrapper">
            <h4 className='detailTitleMin768'>
                {t("themeDetail.tDL.tDLFacility.tDLFacilityFac")}
            </h4>
            {!isFullMobile && <div className='emptyLine1px'></div>}
            <div className="themeDetailBasicInfoCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.facilities?.map((facilities, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <p className='themeDetailInfoTitle'>{facilities?.name?.[lang]}</p>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>{facilities?.businessHour?.[lang]} | {facilities?.location}</p>
                                    <p>{facilities?.breakTime?.[lang] && `${t("themeDetail.tDL.tDLFacility.tDLFacilityBT")}: ${facilities.breakTime?.[lang]}`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </section>
      {isFullMobile && <div className='emptyLine'></div>}
    </>
  )
}

export default ThemeDetailLodging