import React, {useState, useRef} from 'react'

//Page css
import './ThemeDetailLodging.style.css'

const ThemeDetailLodging = ({data, isFullMobile}) => {
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
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{data?.description?.type} 정보</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{data?.description?.type} 정보</h1>}
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkIn" />
                    <span className="title">체크인</span>
                    <span className="value">{data?.info?.checkIn}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/clockIcon.png" alt="checkOut" />
                    <span className="title">체크아웃</span>
                    <span className="value">{data?.info?.checkOut}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/infoIcon.png" alt="info" />
                    <span className="title">주요 시설</span>
                    <span className="value">{data?.info?.facility.join(", ")}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/cancelIcon.png" alt="noProvided" />
                    <span className="title">미제공</span>
                    <span className="value">{data?.info?.noProvided.join(", ")}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/parkingsIcon.png" alt="parking" />
                    <span className="title">주차</span>
                    <span className="value">{data?.info?.parking?"투숙 시 무료 주차":"주차 불가능. 해당 숙소에 문의 필요"}</span>
                </div>
                <div className="themeDetailBasicInfoSubCover">
                    <img src="/images/icon/travelIcon.png" alt="travel" />
                    <span className="title">주변 명소</span>
                    <span className="value">{data?.info?.nearby}</span>
                </div>
            </div>
        </section>
        {/* 숙소 객실 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>객실 유형 (가격 홈페이지 확인)</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>객실 유형 (가격 홈페이지 확인)</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    {isFullMobile && 
                        <h2 className="themeDetailRoomInfoListTitle">
                            {data?.rooms[currentIndex]?.category}
                        </h2>
                    }
                    <div 
                        className="themeDetailRoomInfoList"
                        ref={scrollRef} 
                        onScroll={handleScroll}
                    >
                        {data?.rooms?.map((rooms, idx) => (
                            <div className="roomCard" key={idx}>
                                <h3>{!isFullMobile && rooms.category} {rooms.type}</h3>
                                <div className="roomCardInfo">
                                    <p><span>침대</span>{isFullMobile && ":"} {rooms.bed}</p>
                                    <p><span>최대 인원</span>{isFullMobile && ":"} {rooms.capacity}명</p>
                                    <p><span>전망</span>{isFullMobile && ":"} {rooms.view.join("뷰, ")}뷰</p>
                                    <p><span>객실 수</span>{isFullMobile && ":"} {rooms.count}실</p>
                                    <p><span>면적</span>{isFullMobile && ":"} {rooms.size}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        {/* 숙소 식당 및 카페 정보 */}
        <section className="themeDetailLodgingInfoWholeCover">
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>{data?.description?.type} 식당</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>{data?.description?.type} 식당</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.restaurants?.map((restaurants, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <h3>{restaurants.name} {restaurants.english}</h3>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>{restaurants.type} | {restaurants?.businessHour[0]?.title}{restaurants?.businessHour[0]?.time}({restaurants?.businessHour[0]?.season}) | {restaurants.location} | {restaurants.seats}석</p>
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
            {!isFullMobile && <h1 className='themeDetailBasicInfoH1'>부대 시설</h1>}
            {!isFullMobile && <div className='emptyLine1px'></div>}
            {isFullMobile && <div className='emptyLine'></div>}
            <div className="themeDetailBasicInfoCover">
                {isFullMobile && <h1 className='themeDetailBasicInfoH3'>부대 시설</h1>}
                <div className="themeDetailRoomInfoSubCover">
                    <div 
                        className="themeDetailRestaurantsInfoList"
                    >
                        {data?.facilities?.map((facilities, idx) => (
                            <div className="themeDetailRestaurantsInfoListCard" key={idx}>
                                <h3>{facilities?.name}</h3>
                                <div className="themeDetailRestaurantsInfoListCardInfo">
                                    <p>{facilities?.businessHour} | {facilities?.location}</p>
                                    <p>{facilities?.breakTime && `쉬는 시간: ${facilities.breakTime}`}</p>
                                    <p></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default ThemeDetailLodging