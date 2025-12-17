import React from "react";
import { useNavigate } from "react-router-dom";

const TopPlacesComponent = ({
  selectedAll,
  isMobile,
  isFullMobile,
  isDesktop,
  rankingList = [],
  onSelect,
  lang
}) => {
  const navigate = useNavigate();

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
            alt={selectedAll?.location?.name?.[lang]}
          />
          <span className="topRanking">TOP {selectedAll?.top}</span>
          <p>{selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}</p>
        </div>
      ) : (
        <div className="mainCard">
          <div className="mainCardImg" onClick={goToLocationDetail}>
            {selectedAll && (
              <>
                <img
                  src={selectedAll?.img?.link + "3.jpg"}
                  alt={selectedAll?.location?.name?.[lang]}
                />

                <article className="mainCardImgTextCover">
                  <p className="mainCardTop">
                    Top {selectedAll.top}
                  </p>

                  <h2 className="mainCardLocation">
                    {selectedAll?.location?.name?.[lang]}
                  </h2>

                  <p className="mainCardRegion">
                    <img src="/images/icon/regionIconS.png" alt="region icon" />
                    {selectedAll?.location?.region?.[lang]}
                  </p>

                  <p className="mainCardExplain">
                    {selectedAll?.description?.slide?.[lang]}
                  </p>

                  {isDesktop && <p className="mainCardLast">
                    {selectedAll?.description?.last?.[lang]}
                  </p>}
                </article>
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
                  alt={menu?.location?.name?.[lang]}
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
