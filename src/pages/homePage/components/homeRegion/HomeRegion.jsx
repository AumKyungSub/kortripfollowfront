import React, { useState, useEffect } from "react";

// (hook) Transition Language
import { useTranslation } from "react-i18next";

// (hook) Navigate
import { useNavigate } from "react-router-dom";

// (custom hook) Region List
import { useRegionList } from '@/shared/hooks/useRegionList';

// Page css
import "./HomeRegion.style.css";

const HomeRegion = ({ rankingData = [], lang, isFullMobile }) => {
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
      <div className="homeRegionWrapper">
          <h2>{t("homepage.homeRegion.title")}</h2>

        <div className="homeRegionCover">
          {regionOptions.map((region, index) => {
            const list = filterByRegion(region.code);
            const randomList = getRandomThreeLocation(list);
            const homeRegionListBgi = `/images/regionBackground/regionBackground${index + 1}${t("language.shortWord")}.jpg`;

            return (
              <div
                key={region.code}
                className="homeRegionList"
                onClick={() => goToRegion(region.code)}
              >
                <div 
                  className='homeRegionListImgCover'
                  style={{ backgroundImage: `url(${homeRegionListBgi})` }}
                ></div>

                {!isFullMobile && 
                  <div className="homeRegionExampleList">
                    <p className="homeRegionCount">
                      {region.code === "ALL"
                        ? rankingData.length
                        : regionCounts[region.code] || 0}
                      {t("homepage.homeRegion.placesSuffix")}
                    </p>
                    <div className="homeRegionListCover">
                      {randomList.map((item) => (
                        <span
                        key={item?.id}
                        className="homeRegionAreaList subFont"
                        >
                          {item?.location?.name?.[lang]}
                        </span>
                      ))}
                    </div>
                    <p className="homeRegionLearnMore subFont">
                      {t("homepage.homeRegion.viewSpots")}
                    </p>
                  </div>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeRegion;
