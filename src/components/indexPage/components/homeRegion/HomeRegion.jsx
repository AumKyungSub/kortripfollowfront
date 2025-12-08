import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./HomeRegion.style.css";

const HomeRegion = ({ rankingData = [] }) => {
  const { t, i18n } = useTranslation();

  const [regionList, setRegionList] = useState([]);
  const [regionCount, setRegionCount] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(rankingData) || rankingData.length === 0) return;

    setRegionList(rankingData);

    // 지역 개수 계산
    const counts = rankingData.reduce((count, item) => {
      const regionCode = item.location?.region?.code || "ETC";
      count[regionCode] = (count[regionCode] || 0) + 1;
      return count;
    }, {});

    setRegionCount(counts);
  }, [rankingData]);

  // 특정 지역 랜덤 3개
  const getRandomLocationsByRegion = (regionCode) =>
    regionList
      .filter((data) => data.location?.region?.code === regionCode)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

  // 전체 랜덤 3개
  const getRandomAllLocations = () =>
    [...regionList].sort(() => Math.random() - 0.5).slice(0, 3);

  // 지역 목록 정의
  const regionOptions = [
    { code: "ALL", label: t("homepage.homeRegion.regions.all") },
    { code: "SEOUL", label: t("homepage.homeRegion.regions.seoul") },
    { code: "GGICN", label: t("homepage.homeRegion.regions.ggIncheon") },
    { code: "GANGWON", label: t("homepage.homeRegion.regions.gangwon") },
    { code: "CCDAEJEON", label: t("homepage.homeRegion.regions.ccDaejeon") },
    { code: "GSBUSANDAEGUULSAN", label: t("homepage.homeRegion.regions.gsBusanDaeguUlsan") },
    { code: "JRGWANGJU", label: t("homepage.homeRegion.regions.jrGwangju") },
    { code: "JEJU", label: t("homepage.homeRegion.regions.jeju") },
  ];

  const goToRegion = (regionCode) => {
    navigate("/region", { state: { selectedRegionCode: regionCode } });
  };

  return (
    <div className="homeRegionBackground">
      <div className="homeRegionWholeCover">
        <h3>{t("homepage.homeRegion.title")}</h3>

        <div className="homeRegionCover">
          {regionOptions.map((region, index) => (
            <div
              key={region.code}
              className="homeRegionList"
              onClick={() => goToRegion(region.code)}
            >
              <img
                src={`/images/regionBackground/regionBackground${index + 1}.jpg`}
                alt={region.label}
              />

              <div className="homeRegionListHeader">
                <span className="listHeaderFstSpan">
                  <img src="/images/icon/regionIconS.png" alt="regionIconS" />
                  {region.label}
                </span>

                <span className="listHeaderSndSpan">
                  {region.code === "ALL"
                    ? regionList.length
                    : regionCount[region.code] || 0}
                  {t("homepage.homeRegion.placesSuffix")}
                </span>
              </div>

              <div className="regionExampleList">
                <p className="regionArea">{region.label}</p>

                <div className="regionAreaListCover">
                  {region.code === "ALL"
                    ? getRandomAllLocations().map((item) => (
                        <span key={item?.id} className="regionAreaList">
                          {item?.location?.name?.[i18n.language] ||
                            item?.location?.name?.ko}
                        </span>
                      ))
                    : getRandomLocationsByRegion(region.code).map((item) => (
                        <span key={item?.id} className="regionAreaList">
                          {item?.location?.name?.[i18n.language] ||
                            item?.location?.name?.ko}
                        </span>
                      ))}
                </div>

                <p className="regionLooking">
                  {t("homepage.homeRegion.viewSpots")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeRegion;
