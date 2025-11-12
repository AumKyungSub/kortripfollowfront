import React, {useState,useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

// Components
import Header from '../Header/Header'
import Banner from './components/banner/Banner'
import TopPlaces from './components/topPlaces/TopPlaces'
import Seasons from './components/seasons/Seasons'
import HomeRegion from './components/homeRegion/HomeRegion'
import Footer from '../footer/Footer'

//Page Css
import './Homepage.style.css'

const Homepage = () => {
  // maxWidth: 479, maxWidth: 767, minWidth: 1024
  const {isMobile, isFullMobile, isDesktop} = useResponsive();
  // Data 불러오기
  const [data, setData] = useState([]);
  // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
  const [loading, setLoading] = useState(true);
  // 에러 상테 표시 (초기값: null => 에러 없음)
  const [error, setError] = useState(null);

  // Data 불러오기 처리
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://172.30.1.1:3000/rankings`;
        // const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
        const response = await fetch(url);
        const db = await response.json();
        setData(db);
      } catch (err) {
        console.error("데이터 에러", err);
        setError("데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  // 로딩 화면
  if (loading) return <div>로딩중 ...</div>
  // 에러 화면
  if (error) return <div>{error}</div>
  // 데이터 없을때 화면
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <Header />
      <Banner rankingsData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {!isDesktop && <Seasons/>}
      <TopPlaces rankingsData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>
      {isDesktop && <HomeRegion rankingData={data}/>}
      <Footer/>
    </div>
  )
}

export default Homepage
