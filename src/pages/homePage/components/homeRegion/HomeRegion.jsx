import React, { useState, useEffect } from "react";

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
// Region List
import { useRegionList } from '@/shared/hooks/useRegionList';
/*------------------------/custom hooks-----------------------------------*/

// Page css
import "./HomeRegion.style.css";

const HomeRegion = ({ rankingData = [] }) => {
  // Navigate
  const navigate = useNavigate();
  
  // Device Size Hook 사용
  const {isFullMobile} = useResponsive();
  
  // Language Hook 사용
  const { lang, t } = useLanguage();

  // Region List 사용
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
          <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {t('preTitle.homeRegion')}
          </p>
          <h2 className='title28px40px700'>
            {t("title.homeRegion")}
          </h2>

        <div className="homeRegionCover">
          {regionOptions.map((region, index) => {
            const list = filterByRegion(region.code);
            const randomList = getRandomThreeLocation(list);
            const homeRegionListBgi = `/images/regionBackground/regionBgi${index + 1}.jpg`;

            return (
              <div
                key={region.code}
                className="homeRegionList"
                onClick={() => goToRegion(region.code)}
              >
                <div 
                  className='homeRegionListImgCover'
                  style={{ backgroundImage: `url(${homeRegionListBgi})` }}
                >
                  {isFullMobile &&
                    <p className="homeRegionName">
                      {region.label}
                    </p>
                  }
                  <p className="homeRegionCount">
                    {region.code === "ALL"
                      ? rankingData.length
                      : regionCounts[region.code] || 0}
                    {t("homepage.homeRegion.placesSuffix")}
                  </p>
                </div>

                {!isFullMobile && 
                  <div className="homeRegionExampleList">
                    <p className="homeRegionName">
                      {region.label}
                    </p>
                    <div className="homeRegionListCover">
                      {randomList.map((item) => (
                        <span
                        key={item?.id}
                        className="homeRegionAreaList"
                        >
                          {item?.location?.name?.[lang]}
                        </span>
                      ))}
                    </div>
                    <p className="homeRegionLearnMore">
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
