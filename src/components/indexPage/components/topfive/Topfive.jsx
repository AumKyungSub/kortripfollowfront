import React, { useEffect, useState } from 'react'

// Components
import TopfiveComponent from './TopfiveComponent'
import TopfiveComponentCardImg from './TopfiveComponentCardImg'

// Page CSS
import './Topfive.style.css'


const Topfive = () => {

    const [rankingList, setRankingList] = useState([]);
    const [isPc, setIsPc] = useState(window.innerWidth >= 1024);
    const [selectedAll, setSelectedAll] = useState(null);

    const getRanking =async()=>{
      // let url = `http://localhost:3000/rankings`;
      let url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
      let response = await fetch(url);
      let data = await response.json();

      // id가 1~5인 항목만 필터링
      const topFive = data.filter(item => item.top >= 1 && item.top <= 5);

      // id 순으로 정렬 (혹시 순서가 섞일 경우 대비)
      topFive.sort((a, b) => a.top - b.top);

      // console.log(topFive);
      setRankingList(topFive);

      //첫 접근시 1번 선택
      if (topFive.length > 0) {
        setSelectedAll(topFive[0]);
      }
    };

    useEffect(()=>{
      getRanking()
    },[])
    
        // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsPc(window.innerWidth >= 1024);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 카드 클릭 시 호출되는 함수
    const handleSelect = (item) => {
      setSelectedAll(item);
    };
  
  return (
    <div>
      <section className="top-places">
        <h3 className='topPlaceH3'>채널 추천 여행지 TOP 5</h3>
        <div className="cards">
          <div className="cardsTitle768">
            <h3>채널 추천 여행지 TOP 5</h3>
          </div>
          {!isPc?(
            rankingList.map((menu)=>(
            <TopfiveComponent key={menu.id} item={menu} />
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
