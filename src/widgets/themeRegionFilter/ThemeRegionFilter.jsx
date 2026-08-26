import React, { useEffect, useRef, useState } from "react";

import "./ThemeRegionFilter.style.css";

const REGION_ALL = "__ALL_REGIONS__";
const DISTRICT_ALL = "__ALL_DISTRICTS__";

const ThemeRegionFilter = ({
  regionOptions,
  districtOptions,
  selectedRegion,
  selectedDistrict,
  onRegionChange,
  onDistrictChange,
  onReset,
  resultCount,
  isEn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  const selectedRegionLabel = regionOptions.find(
    (option) => option.code === selectedRegion,
  )?.label;
  const selectedDistrictLabel = districtOptions.find(
    (option) => option.code === selectedDistrict,
  )?.label;
  const selectionLabel =
    selectedRegion === REGION_ALL
      ? isEn
        ? "All"
        : "전체"
      : [
          selectedRegionLabel,
          selectedDistrict !== DISTRICT_ALL ? selectedDistrictLabel : null,
        ]
          .filter(Boolean)
          .join(" · ");

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handlePointerDown = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="themeRegionFilter" ref={filterRef}>
      <button
        type="button"
        className={`themeRegionFilterButton ${selectedRegion !== REGION_ALL ? "active" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-list-sort-descending-icon lucide-list-sort-descending"
        >
          <path d="M15 12H3" />
          <path d="M3 5h18" />
          <path d="M9 19H3" />
        </svg>
        <span>{isEn ? "Region" : "지역"}</span>
        <strong>{selectionLabel}</strong>
        <svg
          className={isOpen ? "open" : ""}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="themeRegionFilterBackdrop" aria-hidden="true" />
          <section
            className="themeRegionFilterPanel"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? "Select region" : "지역 선택"}
          >
            <div className="themeRegionFilterHeader">
              <div>
                <span>REGION FILTER</span>
                <h3>{isEn ? "Select region" : "지역 선택"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={isEn ? "Close" : "닫기"}
              >
                ×
              </button>
            </div>

            <div className="themeRegionFilterSection">
              <p>{isEn ? "Region" : "지역"}</p>
              <div className="themeRegionFilterOptions">
                {regionOptions.map((option) => (
                  <button
                    type="button"
                    key={option.code}
                    className={selectedRegion === option.code ? "active" : ""}
                    onClick={() => onRegionChange(option.code)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedRegion !== REGION_ALL && districtOptions.length > 1 && (
              <div className="themeRegionFilterSection themeRegionFilterDistricts">
                <p>{isEn ? "City / District" : "상세 지역"}</p>
                <div className="themeRegionFilterOptions">
                  {districtOptions.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      className={
                        selectedDistrict === option.code ? "active" : ""
                      }
                      onClick={() => onDistrictChange(option.code)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="themeRegionFilterActions">
              <button
                type="button"
                className="themeRegionFilterReset"
                onClick={onReset}
              >
                {isEn ? "Reset" : "초기화"}
              </button>
              <button
                type="button"
                className="themeRegionFilterApply"
                onClick={() => setIsOpen(false)}
              >
                {isEn ? `View ${resultCount} places` : `${resultCount}곳 보기`}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ThemeRegionFilter;
