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

  const addressText = lang === "ko"
    ? selectedAll?.location?.address?.ko?.[0]
    : selectedAll?.location?.address?.en?.[1];
  
  const bgcImg = selectedAll?.img?.link + "0M.jpg";

  return (
    <>
      {isFullMobile ? (
        <div className="card" onClick={goToLocationDetail}>
          <div className="cardImgCover" style={{ backgroundImage: `url(${bgcImg})` }}>
          </div>
          <div className="cardTextCover">
            <span className='topName'>{selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}</span>
            <span className="topRanking">{addressText || ""}</span>
          </div>
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
