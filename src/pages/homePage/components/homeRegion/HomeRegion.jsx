import React, { useState, useEffect } from "react";

// (hook) Transition Language
import { useTranslation } from "react-i18next";

// (hook) Navigate
import { useNavigate } from "react-router-dom";

// (custom hook) Region List
import { useRegionList } from '@/shared/hooks/useRegionList';

// Page css
import "./HomeRegion.style.css";

const HomeRegion = ({ rankingData = [], lang }) => {
  // Transition Language
  const { t } = useTranslation();
  // Navigate
  const navigate = useNavigate();

  const {
    regionOptions,
    regionCounts,
    filterByRegion,
  } = useRegionList({
    data: rankingData,
    lang,
  });

  // 전체 랜덤 3개
  const getRandomThreeLocation = (list) =>
    [...list].sort(() => Math.random() - 0.5).slice(0, 3);

  const goToRegion = (regionCode) => {
    navigate("/region", { state: { selectedRegionCode: regionCode } });
  };

  return (
    <div className="homeRegionBackground">
      <div className="homeRegionWholeCover">
        <h3>{t("homepage.homeRegion.title")}</h3>

        <div className="homeRegionCover">
          {regionOptions.map((region, index) => {
            const list = filterByRegion(region.code);
            const randomList = getRandomThreeLocation(list);

            return (
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
                    <img
                      src="/images/icon/regionIconS.png"
                      alt="regionIconS"
                    />
                    {region.label}
                  </span>

                  <span className="listHeaderSndSpan">
                    {region.code === "ALL"
                      ? rankingData.length
                      : regionCounts[region.code] || 0}
                    {t("homepage.homeRegion.placesSuffix")}
                  </span>
                </div>

                <div className="regionExampleList">
                  <p className="regionArea">{region.label}</p>

                  <div className="regionAreaListCover">
                    {randomList.map((item) => (
                      <span
                        key={item?.id}
                        className="regionAreaList"
                      >
                        {item?.location?.name?.[lang]}
                      </span>
                    ))}
                  </div>

                  <p className="regionLooking">
                    {t("homepage.homeRegion.viewSpots")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeRegion;
