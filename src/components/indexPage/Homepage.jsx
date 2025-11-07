import React, {useState,useEffect} from 'react'

// Components
import Header from '../Header/Header'
import Banner from './components/banner/Banner'
import Topfive from './components/topfive/Topfive'
import Seasons from './components/seasons/Seasons'
import HomeRegion from './components/homeRegion/HomeRegion'
import Footer from '../footer/Footer'

//Page Css
import './Homepage.style.css'

const Homepage = () => {
  // 1023px이하 일 경우
  const [isNotPc, setIsNotPc] = useState(window.innerWidth <= 1023);
  // Data 불러오기
  const [data, setData] = useState([]);
    
  // 화면 크기 변경 시 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsNotPc(window.innerWidth <= 1023);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data 불러오기 처리
  useEffect(() => {
    const fetchData = async () => {
      const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
      const response = await fetch(url);
      const db = await response.json();
      setData(db);
    };
    fetchData();
  },[]);

  return (
    <div>
      <Header />
      <Banner rankingsData={data}/>
      {isNotPc && <Seasons/>}
      <Topfive rankingsData={data}/>
      {!isNotPc && <HomeRegion rankingData={data}/>}
      <Footer/>
    </div>
  )
}

export default Homepage
