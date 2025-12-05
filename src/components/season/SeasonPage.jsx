import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
import EmptyHeader from '../commonComponents/emptyHeader/EmptyHeader'
import SeasonCategory from './component/seasonCategory/SeasonCategory'
import SeasonBanner from './component/seasonBanner/SeasonBanner'
import SeasonList from './component/seasonList/SeasonList'
import Footer from '../footer/Footer'

// Page css
import './SeasonPage.style.css'

const SeasonPage = () => {
    const {isFullMobile} = useResponsive();
  const location = useLocation();
  const initialSeason = location.state?.selectedSeason || '봄'
  const [selectedSeason, setSelectedSeason] = useState(initialSeason); 
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
        const urlS = `${import.meta.env.VITE_API_URL}/seasons`;
        const urlR = `${import.meta.env.VITE_API_URL}/rankings`;

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
  if (loading) return <div><Loading/></div>
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
      {!isFullMobile && <EmptyHeader/>}
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
