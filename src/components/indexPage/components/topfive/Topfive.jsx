import React, { useEffect, useState } from 'react'

// Components
import TopfiveComponent from './TopfiveComponent'
import TopfiveComponentCardImg from './TopfiveComponentCardImg'

// Page CSS
import './Topfive.style.css'


const Topfive = ({rankingsData = []}) => {

  const [rankingList, setRankingList] = useState([]);
  const [isPc, setIsPc] = useState(window.innerWidth >= 1024);
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

  // 화면 크기 변경 시 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 카드 클릭 시 호출되는 함수
  const handleSelect = (clickCard) => {
    setSelectedAll(clickCard);
  };
  
  return (
    <div>
      <section className="topPlaces">
        <h3 className='topPlaceH3'>채널 추천 여행지 TOP 5</h3>
        <div className="cards">
          <div className="cardsTitle768">
            <h3>채널 추천 여행지 TOP 5</h3>
          </div>
          {!isPc?(
            rankingList.map((menu)=>(
              <TopfiveComponent key={menu.id} rankingsTopFive={menu} />
            ))
          ):(
          <TopfiveComponentCardImg
            rankingList={rankingList}
            onSelect={handleSelect}
            selectedAll={selectedAll}
          />
          )}
        </div>
      </section>
    </div>
  )
}

export default Topfive
