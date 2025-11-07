import React from 'react'

import { useNavigate } from 'react-router-dom'

import TopfiveComponentPc from './TopfiveComponentPc'

const TopfiveComponentCardImg = ({rankingList, onSelect, selectedAll}) => {
    const navigate = useNavigate();

    const goToLocationDetail = () => {
        onSelect(selectedAll);
        navigate(`/location/${selectedAll.id}`);
    };

    return (
    <div className="mainCard">
        <div className="mainCardImg" onClick={goToLocationDetail}>
            {selectedAll && (
                <>
                    <img src={selectedAll.imgName+"3.jpg"} alt="선택된 여행지"/>
                    <div className="mainCardImgTextCover">
                        {/* TOP 옆에 있는 icon은 icon이름을 12345로 정해서 해당 icon 입력 */}
                        <span className="mainCardTop">
                            <img src={`/images/icon/rank${selectedAll.top}.png`} alt="{`/images/icon/rank${selectedAll.top}.png`}" />
                            Top {selectedAll.top}
                        </span>
                        <p className="mainCardRegion">
                            <img src="/images/icon/regionIconS.png" alt="/images/icon/regionIconS.png" />
                            {selectedAll.region}
                        </p>
                        <h2 className="mainCardLocation">{selectedAll.location}</h2>
                        <p className="mainCardExplain">{selectedAll.explainSide}</p>
                    </div>
                </>
            )}
        </div>
        <div className="mainCardCover">
            {rankingList.map((menu)=>(
                <TopfiveComponentPc 
                    key={menu.id} 
                    rankingClickList={menu} 
                    onSelect={()=> onSelect(menu)}
                    isSelected={menu.top === selectedAll.top}
                />
            ))}
        </div>
    </div>
  )
}

export default TopfiveComponentCardImg
