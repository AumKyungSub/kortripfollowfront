import React from 'react'

// (hook) Navigate
import { useNavigate } from "react-router-dom";

const HomeRecommendedComponent = ({
    selectedAll,
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

    const bgcImgMobile = selectedAll?.img?.link + "0M.jpg";
    const bgcImgDesktop = selectedAll?.img?.link + "3.jpg";

    return (
        <>
            {isFullMobile ? (
                <div className="homeRecommendedCard" onClick={goToLocationDetail}>
                    <div className="homeRecommendedCardImgCover" style={{ backgroundImage: `url(${bgcImgMobile})` }}></div>
                    <div className="homeRecommendedCardTextCover">
                        <p className='homeRecommendedName'>{selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}</p>
                        <p className="homeRecommendedRegion subFont">{addressText || ""}</p>
                    </div>
                </div>
            ) : (
                <div className="homeRecommendedMainCardCover">
                    <div 
                        className="homeRecommendedMainCardImg" 
                        onClick={goToLocationDetail}
                        style={{ backgroundImage: `url(${bgcImgDesktop})` }}
                    >
                        <article className="homeRecommendedMainCardImgTextCover">
                            <h3 className="homeRecommendedMainCardRegion">
                                {selectedAll?.location?.name?.[lang]}
                            </h3>
                            <span className="homeRecommendedMainCardLocation">
                                <img src="/images/icon/regionIconS.png" alt="region icon" />
                                <p className='subFont'>
                                    {selectedAll?.location?.region?.[lang]}
                                </p>
                            </span>
                            <p className="homeRecommendedMainCardExplain">
                                {selectedAll?.description?.slide?.[lang]}
                            </p>
                        </article>
                    </div>
                    <div className="homeRecommendedListCardCover">
                        {rankingList.map((menu) => (
                            <div
                                key={menu.id}
                                className={`homeRecommendedListCard ${menu.top === selectedAll?.top ? "selected" : ""}`}
                                onClick={() => onSelect(menu)}
                                style={{ backgroundImage: `url(${menu?.img?.link + "2.jpg"})` }}
                            >
                                <p>{menu?.top}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default HomeRecommendedComponent