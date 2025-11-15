import React from 'react'

// Page css
import './ThemeDetailCafeInfo.style.css'

const ThemeDetailCafeInfo = ({data, isFullMobile}) => {

    const goToMenu = () => {
        window.open(data?.description?.menuLink, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="themeDetailCafeInfoWholeCover">
                {!isFullMobile && <h1 className='themeDetailInfoH1'>카페 정보</h1>}
                {!isFullMobile && <div className='emptyLine1px'></div>}
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoOperatingHourCover">
                    <h3 className='themeDetailInfoH3'>영업 시간</h3>
                    <p className='themeDetailInfoP'>
                        {data?.operating?.operatingHour}{" "}
                        {data?.operating?.closeDay && <span className='themeDetailInfoSpan'>{data?.operating?.closeDay}<br/></span>}
                        {data?.operating?.breakTime && <>{data?.operating?.breakTime}<br/></>}
                        {data?.operating?.lastOrder && <>{data?.operating?.lastOrder}<br/></>}
                        {data?.operating?.etc && <span className='themeDetailInfoSpanS'>{data?.operating?.etc}</span>}
                    </p>
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoMenu">
                    <h3 className='themeDetailInfoH3'>메뉴</h3>
                    <div className='themeDetailInfoP themeDetailInfoMenuCover'>
                        <div className="themeDetailInfoMenuLeftCover">
                            {data?.description?.menu?.map((item, idx) => (
                                <span key={idx}>
                                    {item}<br />
                                </span>
                            ))}
                        </div>
                        <div className="themeDetailInfoMenuRightCover">
                            {data?.description?.price?.map((item, idx) => (
                                <span key={idx}>
                                    {item}원<br/>
                                </span>
                            ))}
                            {!isFullMobile && <button className='themeDetailInfoBtn' onClick={goToMenu}>전체 메뉴 보기 <img src="/images/icon/rightBlackIcon.png" alt="arrow" /></button>}
                        </div>
                    </div>
                    <br/>
                    {isFullMobile && <button className='themeDetailInfoBtn' onClick={goToMenu}>전체 메뉴 보기</button>}
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoOthers">
                    <h3 className='themeDetailInfoH3'>특징</h3>
                    <p className='themeDetailInfoP'>
                        {data?.info?.parking && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/parkingsIcon.png" alt="parking" />주차 가능<br /></span>}
                        {data?.info?.takeOut && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/takeawayIcon.png" alt="takeaway" />포장 가능<br /></span>}
                        {data?.info?.pet && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/petIcon.png" alt="pet" />애완동물 가능<br /></span>}
                        {data?.info?.reserve && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/bookingIcon.png" alt="reserve" />예약 가능</span>}
                    </p>
                </div>
            </section>
        </>
    )
}

export default ThemeDetailCafeInfo
