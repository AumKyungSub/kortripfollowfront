import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './ThemeDetailCafeInfo.style.css'

const ThemeDetailCafeInfo = ({data, isFullMobile, themeName, lang}) => {

    const {t} = useTranslation();

    const goToMenu = () => {
        window.open(data?.description?.menuLink, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="themeDetailCafeInfoWholeCover">
                {!isFullMobile && <h1 className='themeDetailInfoH1'>{themeName} {t("themeDetail.tDCI.tDCIHInfo")}</h1>}
                {!isFullMobile && <div className='emptyLine1px'></div>}
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoOperatingHourCover">
                    <h3 className='themeDetailInfoH3'>{t("themeDetail.tDCI.tDCIHOperating")}</h3>
                    <p className='themeDetailInfoP'>
                        {data?.operating?.operatingHour?.[lang]}{" "}
                        {data?.operating?.closeDay?.[lang] && <span className='themeDetailInfoSpan'>{data?.operating?.closeDay?.[lang]}<br/></span>}
                        {data?.operating?.breakTime?.[lang] && <>{data?.operating?.breakTime?.[lang]}<br/></>}
                        {data?.operating?.lastOrder?.[lang] && <>{data?.operating?.lastOrder?.[lang]}<br/></>}
                        {data?.operating?.etc?.[lang] && <span className='themeDetailInfoSpanS'>{data?.operating?.etc?.[lang]}</span>}
                    </p>
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoMenu">
                    <h3 className='themeDetailInfoH3'>{t("themeDetail.tDCI.tDCIHMenu")}</h3>
                    <div className='themeDetailInfoP themeDetailInfoMenuCover'>
                        <div className="themeDetailInfoMenuLeftCover">
                            {data?.description?.menu?.[lang]?.map((item, idx) => (
                                <span key={idx}>
                                    {item}<br />
                                </span>
                            ))}
                        </div>
                        <div className="themeDetailInfoMenuRightCover">
                            {data?.description?.price?.map((item, idx) => (
                                <span key={idx}>
                                    {item} {t("themeDetail.tDCI.tDCIHWON")}<br/>
                                </span>
                            ))}
                            {!isFullMobile && <button className='themeDetailInfoBtn' onClick={goToMenu}>{t("themeDetail.tDCI.tDCIHAllMenu")} <img src="/images/icon/rightBlackIcon.png" alt="arrow" /></button>}
                        </div>
                    </div>
                    <br/>
                    {isFullMobile && <button className='themeDetailInfoBtn' onClick={goToMenu}>{t("themeDetail.tDCI.tDCIHAllMenu")}</button>}
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInfoOthers">
                    <h3 className='themeDetailInfoH3'>{t("themeDetail.tDCI.tDCIHAmenities")}</h3>
                    <p className='themeDetailInfoP'>
                        {data?.info?.parking && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/parkingsIcon.png" alt="parking" />{t("themeDetail.tDCI.tDCIParking")}<br /></span>}
                        {data?.info?.takeOut && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/takeawayIcon.png" alt="takeaway" />{t("themeDetail.tDCI.tDCITake")}<br /></span>}
                        {data?.info?.pet && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/petIcon.png" alt="pet" />{t("themeDetail.tDCI.tDCIPet")}<br /></span>}
                        {data?.info?.reserve && <span className='themeDetailInfoOthersSpan'><img src="/images/icon/bookingIcon.png" alt="reserve" />{t("themeDetail.tDCI.tDCIReserve")}</span>}
                    </p>
                </div>
            </section>
        </>
    )
}

export default ThemeDetailCafeInfo
