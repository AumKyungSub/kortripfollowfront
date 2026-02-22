import React from 'react'

import { useTranslation } from 'react-i18next'

// Page css
import './ThemeDetailInformation.style.css'

const ThemeDetailInformation = ({data, isFullMobile, themeName, lang}) => {

    const {t} = useTranslation();

    const goToMenu = () => {
        window.open(data?.description?.menuLink, "_blank", "noopener,noreferrer");
    }

    return (
        <>
            <section className="themeDetailCafeInfoWholeCover">
                {!isFullMobile && <h4 className='detailTitleMin768'>{themeName} {t("themeDetail.tDCI.tDCIHInfo")}</h4>}
                {!isFullMobile && <div className='emptyLine1px'></div>}
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInformationCover">
                    <h4 className='themeDetailInformationTitle'>{t("themeDetail.tDCI.tDCIHOperating")}</h4>
                    <div className='themeDetailInformationTextCover'>
                        {data?.operating?.operatingHour?.[lang]}{" "}
                        {data?.operating?.closeDay?.[lang] && 
                            <p className='themeDetailInformationNote'>
                                {data?.operating?.closeDay?.[lang]}
                            </p>}
                        {data?.operating?.breakTime?.[lang] && 
                            <p>
                                {data?.operating?.breakTime?.[lang]}
                            </p>
                        }
                        {data?.operating?.lastOrder?.[lang] && 
                            <p>
                                {data?.operating?.lastOrder?.[lang]}
                            </p>
                        }
                        {data?.operating?.etc?.[lang] && 
                            <p className='themeDetailInformationNote'>
                                {data?.operating?.etc?.[lang]}
                            </p>
                        }
                    </div>
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInformationCover">
                    <h4 className='themeDetailInformationTitle'>{t("themeDetail.tDCI.tDCIHMenu")}</h4>
                    <div className='themeDetailInfoMenuCover'>
                        <div className="themeDetailInfoMenuLeftCover">
                            {data?.description?.menu?.[lang]?.map((item, idx) => (
                                <span key={idx}>
                                    <p className='themeDetailInformationText'>
                                        {item}<br />
                                    </p>
                                </span>
                            ))}
                        </div>
                        <div className="themeDetailInfoMenuRightCover">
                            {data?.description?.price?.map((item, idx) => (
                                <span key={idx}>
                                    <p className='themeDetailInformationText'>
                                        {item} {t("themeDetail.tDCI.tDCIHWON")}<br/>
                                    </p>
                                </span>
                            ))}
                        </div>
                    </div>
                    <button className='themeDetailInfoBtn' onClick={goToMenu}>
                        <p className='subFont'>
                            {t("themeDetail.tDCI.tDCIHAllMenu")} 
                        </p>
                    </button>
                </div>
                {isFullMobile && <div className='emptyLine'></div>}
                <div className="themeDetailInformationCover">
                    <h4 className='themeDetailInformationTitle'>{t("themeDetail.tDCI.tDCIHAmenities")}</h4>
                    <div className='themeDetailInformationTextCover'>
                        {data?.info?.parking && 
                            <span className='themeDetailInfoOthersSpan'>
                                <img src="/images/icon/parkingsIcon.png" alt="parking" />
                                <p>
                                    {t("themeDetail.tDCI.tDCIParking")}
                                </p>
                            </span>
                        }
                        {data?.info?.takeOut && 
                            <span className='themeDetailInfoOthersSpan'>
                                <img src="/images/icon/takeawayIcon.png" alt="takeaway" />
                                <p>
                                    {t("themeDetail.tDCI.tDCITake")}
                                </p>
                            </span>
                        }
                        {data?.info?.pet && 
                            <span className='themeDetailInfoOthersSpan'>
                                <img src="/images/icon/petIcon.png" alt="pet" />
                                <p>
                                    {t("themeDetail.tDCI.tDCIPet")}
                                </p>
                            </span>
                        }
                        {data?.info?.reserve && 
                            <span className='themeDetailInfoOthersSpan'>
                                <img src="/images/icon/bookingIcon.png" alt="reserve" />
                                <p>
                                    {t("themeDetail.tDCI.tDCIReserve")}
                                </p>
                            </span>
                        }
                    </div>
                </div>
            </section>
            {isFullMobile && <div className='emptyLine'></div>}
        </>
    )
}

export default ThemeDetailInformation