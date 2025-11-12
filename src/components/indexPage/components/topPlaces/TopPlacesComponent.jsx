import React from 'react'

import { useNavigate } from 'react-router-dom'

const TopPlacesComponent = ({selectedAll, isMobile, isFullMobile, isDesktop, rankingList, onSelect}) => {
    const navigate = useNavigate();

    const goToLocationDetail = () => {
        if (typeof onSelect === "function") {
            onSelect(selectedAll);
        }

        navigate(`/location/${selectedAll?.id}`);
    };
    return (
    <>
        {!isDesktop ? (
            <div className='card' onClick={goToLocationDetail}>
                    <img src={isMobile?selectedAll?.top === 1?selectedAll?.img?.link+"0M.jpg":selectedAll?.img?.link+"1.jpg"
                        :isFullMobile?selectedAll?.top === 1?selectedAll?.img?.link+"0Z.jpg":selectedAll?.img?.link+"1.jpg"
                        :selectedAll?.top === 1?selectedAll?.img?.link+"0T.jpg":selectedAll?.img?.link+"1.jpg"
                    } alt={selectedAll?.location?.name} />
                    <span className='topRanking'>
                        TOP {selectedAll?.top}
                    </span>
                    <p>{selectedAll?.location?.name}</p>
            </div>
        ):(
            <div className="mainCard">
                <div className="mainCardImg" onClick={goToLocationDetail}>
                    {selectedAll && (
                        <>
                            <img src={selectedAll?.img?.link+"3.jpg"} alt={selectedAll?.location?.name}/>
                            <div className="mainCardImgTextCover">
                                {/* TOP 옆에 있는 icon은 icon이름을 12345로 정해서 해당 icon 입력 */}
                                <span className="mainCardTop">
                                    <img src={`/images/icon/rank${selectedAll.top}.png`} alt={"TOP "+selectedAll.top} />
                                    Top {selectedAll.top}
                                </span>
                                <p className="mainCardRegion">
                                    <img src="/images/icon/regionIconS.png" alt={selectedAll?.location?.name} />
                                    {selectedAll?.location?.region[0]}
                                </p>
                                <h2 className="mainCardLocation">{selectedAll?.location?.name}</h2>
                                <p className="mainCardExplain">{selectedAll?.description?.slide}</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="mainCardCover">
                    {rankingList.map((menu)=>(
                        <div
                        key={menu.id}
                            className={`card ${menu.top === selectedAll?.top ? "selected" : ""}`}
                            onClick={()=> onSelect(menu)}
                        >
                            <img src={menu?.img?.link+"2.jpg"} alt={menu?.location?.name} />
                            <p>{menu?.top}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>
    )
}

export default TopPlacesComponent
