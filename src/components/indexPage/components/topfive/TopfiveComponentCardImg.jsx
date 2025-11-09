import React from 'react'

import { useNavigate } from 'react-router-dom'

import TopfiveComponentPc from './TopfiveComponentPc'

const TopfiveComponentCardImg = ({rankingList, onSelect, selectedAll}) => {
    const navigate = useNavigate();

    const goToLocationDetail = () => {
        onSelect(selectedAll);
        navigate(`/location/${selectedAll?.id}`);
    };

    return (
    <div className="mainCard">
        <div className="mainCardImg" onClick={goToLocationDetail}>
            {selectedAll && (
                <>
                    <img src={selectedAll?.img?.link+"3.jpg"} alt="선택된 여행지"/>
                    <div className="mainCardImgTextCover">
                        {/* TOP 옆에 있는 icon은 icon이름을 12345로 정해서 해당 icon 입력 */}
                        <span className="mainCardTop">
                            <img src={`/images/icon/rank${selectedAll.top}.png`} alt="{`/images/icon/rank${selectedAll.top}.png`}" />
                            Top {selectedAll.top}
                        </span>
                        <p className="mainCardRegion">
                            <img src="/images/icon/regionIconS.png" alt="/images/icon/regionIconS.png" />
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
                <TopfiveComponentPc 
                    key={menu.id} 
                    rankingClickList={menu} 
                    onSelect={()=> onSelect(menu)}
                    isSelected={menu.top === selectedAll?.top}
                />
            ))}
        </div>
    </div>
  )
}

export default TopfiveComponentCardImg
