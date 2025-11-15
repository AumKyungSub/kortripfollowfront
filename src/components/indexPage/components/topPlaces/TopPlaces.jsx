import React, {useState, useEffect} from 'react'

import TopPlacesComponent from './TopPlacesComponent';

// Page css
import './TopPlaces.style.css'

const TopPlaces = ({rankingsData = [], isMobile, isFullMobile, isDesktop}) => {
    const [rankingList, setRankingList] = useState([]);
    const [selectedAll, setSelectedAll] = useState(null);
    
    // 데이터 top 1~5까지만 필터링
    useEffect(() => {
        // null일 경우 방어용
        if (!Array.isArray(rankingsData)) return; 
    
        const topFive = rankingsData
            .filter(topRanking => topRanking?.top >= 1 && topRanking?.top <= 5)
            .sort((a, b) => a.top - b.top);
        setRankingList(topFive);
        if (topFive.length > 0) {
            setSelectedAll(topFive[0]);
        }
    }, [rankingsData]);

    // 카드 클릭 시 호출되는 함수
    const handleSelect = (clickCard) => {
        setSelectedAll(clickCard);
    };
    
    return (
    <>
        <section className="topPlaces">
            {isFullMobile && <h3 className='topPlaceH3'>채널 추천 여행지 TOP 5</h3>}
            <div className="cards">
                <div className="cardsTitle768">
                    {!isFullMobile && <h3>채널 추천 여행지 TOP 5</h3>}
                </div>
                {isFullMobile?(
                    rankingList.map((menu)=>(
                    <TopPlacesComponent 
                        key={menu.id} 
                        selectedAll={menu} 
                        isMobile={isMobile} 
                        isFullMobile={isFullMobile} 
                        isDesktop={isDesktop}  
                    />
                    ))
                ):(
                    <TopPlacesComponent
                        key={rankingList.id}
                        rankingList={rankingList}
                        onSelect={handleSelect}
                        selectedAll={selectedAll}
                        isDesktop={isDesktop}  
                    />
                )}
            </div>
        </section>
    </>
    )
}

export default TopPlaces
