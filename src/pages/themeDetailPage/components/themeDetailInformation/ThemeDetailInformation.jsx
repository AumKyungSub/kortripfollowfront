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
        {!isFullMobile && (
          <>
            <h4 className="detailTitleMin768">
              {themeName} {t("themeDetail.tDCI.tDCIHInfo")}
            </h4>
            <div className="emptyLine1px"></div>
          </>
        )}

        {isFullMobile && <div className="emptyLine"></div>}

        {/* 운영시간 */}
        <div className="themeDetailInformationCover">
          <h4 className="themeDetailInformationTitle">
            {t("themeDetail.tDCI.tDCIHOperating")}
          </h4>

          <div className="themeDetailInformationTextCover">
            {data?.operating?.[lang]?.map((item, idx) => {
              if (item.type === "time") {
                return (
                  <div key={idx} className="row">
                    <p className='themeDetailInformationTextLabel'>{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                );
              }

              if (item.type === "note") {
                return (
                  <p key={idx} className="themeDetailInformationNote">
                    {item.text}
                  </p>
                );
              }

              return null;
            })}
          </div>
        </div>

        {isFullMobile && <div className="emptyLine"></div>}

        {/* 메뉴 */}
<div className="themeDetailInformationCover">
  <h4 className="themeDetailInformationTitle">
    {t("themeDetail.tDCI.tDCIHMenu")}
  </h4>

  <div className="themeDetailInformationTextCover">
    {data?.description?.menu?.[lang]?.map((item, idx) => {
      const hasName = item?.name?.trim();
      const hasPrice = item?.price?.toString().trim();

      if (!hasName && !hasPrice) return null;

      return (
        <div key={idx} className="themeDetailInfoMenuCover">
          {hasName && (
            <p className="themeDetailInformationText">
              {item.name}
            </p>
          )}

          {hasName && hasPrice && (
            <span className="dotLine" />
          )}

          {hasPrice && (
            <p className="themeDetailInformationText">
              {item.price}
            </p>
          )}
        </div>
      );
    })}
  </div>

  {data?.description?.menuLink && (
    <button className="themeDetailInfoBtn" onClick={goToMenu}>
      <p className="subFont">
        {t("themeDetail.tDCI.tDCIHAllMenu")}
      </p>
    </button>
  )}
</div>

        {isFullMobile && <div className="emptyLine"></div>}

        {/* 편의시설 */}
        <div className="themeDetailInformationCover">
          <h4 className="themeDetailInformationTitle">
            {t("themeDetail.tDCI.tDCIHAmenities")}
          </h4>

          <div className="themeDetailInformationTextCover">
            {data?.info?.parking && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/parkingsIcon.png" alt="parking" />
                <p>{t("themeDetail.tDCI.tDCIParking")}</p>
              </span>
            )}

            {data?.info?.takeOut && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/takeawayIcon.png" alt="takeaway" />
                <p>{t("themeDetail.tDCI.tDCITake")}</p>
              </span>
            )}

            {data?.info?.pet && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/petIcon.png" alt="pet" />
                <p>{t("themeDetail.tDCI.tDCIPet")}</p>
              </span>
            )}

            {data?.info?.reserve && (
              <span className="themeDetailInfoOthersSpan">
                <img src="/images/icon/bookingIcon.png" alt="reserve" />
                <p>{t("themeDetail.tDCI.tDCIReserve")}</p>
              </span>
            )}
          </div>
        </div>
      </section>

      {isFullMobile && <div className="emptyLine"></div>}
    </>
    )
}

export default ThemeDetailInformation