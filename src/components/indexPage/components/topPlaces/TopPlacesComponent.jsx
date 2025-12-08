import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopPlacesComponent = ({
  selectedAll,
  isMobile,
  isFullMobile,
  isDesktop,
  rankingList = [],
  onSelect,
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const goToLocationDetail = () => {
    if (typeof onSelect === "function") {
      onSelect(selectedAll);
    }
    navigate(`/location/${selectedAll?.id}`);
  };

  return (
    <>
      {isFullMobile ? (
        <div className="card" onClick={goToLocationDetail}>
          <img
            src={
              isMobile
                ? selectedAll?.top === 1
                  ? selectedAll?.img?.link + "0M.jpg"
                  : selectedAll?.img?.link + "1.jpg"
                : isFullMobile
                ? selectedAll?.top === 1
                  ? selectedAll?.img?.link + "0Z.jpg"
                  : selectedAll?.img?.link + "1.jpg"
                : selectedAll?.top === 1
                ? selectedAll?.img?.link + "0T.jpg"
                : selectedAll?.img?.link + "1.jpg"
            }
            alt={selectedAll?.location?.name?.[i18n.language]}
          />
          <span className="topRanking">TOP {selectedAll?.top}</span>
          <p>{selectedAll?.location?.name?.[i18n.language] || selectedAll?.location?.name?.ko}</p>
        </div>
      ) : (
        <div className="mainCard">
          <div className="mainCardImg" onClick={goToLocationDetail}>
            {selectedAll && (
              <>
                <img
                  src={selectedAll?.img?.link + "3.jpg"}
                  alt={selectedAll?.location?.name?.[i18n.language]}
                />

                <div className="mainCardImgTextCover">
                  <span className="mainCardTop">
                    <img
                      src={`/images/icon/rank${selectedAll.top}.png`}
                      alt={"TOP " + selectedAll.top}
                    />
                    Top {selectedAll.top}
                  </span>

                  <p className="mainCardRegion">
                    <img src="/images/icon/regionIconS.png" alt="region icon" />
                    {selectedAll?.location?.region?.[i18n.language] ||
                      selectedAll?.location?.region?.ko}
                  </p>

                  <h2 className="mainCardLocation">
                    {selectedAll?.location?.name?.[i18n.language] ||
                      selectedAll?.location?.name?.ko}
                  </h2>

                  <p className="mainCardExplain">
                    {selectedAll?.description?.slide?.[i18n.language] ||
                      selectedAll?.description?.slide?.ko}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mainCardCover">
            {rankingList.map((menu) => (
              <div
                key={menu.id}
                className={`card ${menu.top === selectedAll?.top ? "selected" : ""}`}
                onClick={() => onSelect(menu)}
              >
                <img
                  src={menu?.img?.link + "2.jpg"}
                  alt={menu?.location?.name?.[i18n.language]}
                />
                <p>{menu?.top}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TopPlacesComponent;
