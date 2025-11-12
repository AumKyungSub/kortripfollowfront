import React, { useState, useEffect } from 'react'

// Components
import Header from '../Header/Header'
import SeasonCategory from './component/seasonCategory/SeasonCategory'
import SeasonBanner from './component/seasonBanner/SeasonBanner'
import SeasonList from './component/seasonList/SeasonList'
import Footer from '../footer/Footer'

// Page css
import './SeasonPage.style.css'

const SeasonPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('봄'); 
  // Data 불러오기
  const [data, setData] = useState({ dataR: [], dataS: [] });
  // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
  const [loading, setLoading] = useState(true);
  // 에러 상테 표시 (초기값: null => 에러 없음)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlS = `http://172.30.1.1:3000/seasons`;
        const urlR = `http://172.30.1.1:3000/rankings`;
        // const urlS = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/seasons`;
        // const urlR = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;

        const responseS = await fetch(urlS);
        const responseR = await fetch(urlR);

        const dataS = await responseS.json();
        const dataR = await responseR.json();

        setData({dataR, dataS});
      } catch (err) {
        console.error("데이터 에러", err);
        setError("데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 로딩 화면
  if (loading) return <div>로딩중 ...</div>
  // 에러 화면
  if (error) return <div>{error}</div>
  // 데이터 없을때 화면
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

  const filteredListBanner = data.dataS
    .filter(selectSeason => selectSeason.season === selectedSeason)
    .sort(() => Math.random() - 0.5)
    .slice(0, 1);

  const filteredListList = data.dataR
    .filter(selectSeason => 
      selectSeason.season.includes(selectedSeason) || selectSeason.season.includes('사계절')
    )
    .sort(() => Math.random() - 0.5);    
  
  return (
    <div>
      <Header/>
        <SeasonCategory selected={selectedSeason} setSelected={setSelectedSeason} />
        {filteredListBanner.map((sea)=>(
          <SeasonBanner key={sea.id} seasonCategory={sea}/>
        ))}
        <SeasonList
          bannerList={filteredListBanner}
          list={filteredListList}
          />
      <Footer/>
    </div>
  )
}

export default SeasonPage
