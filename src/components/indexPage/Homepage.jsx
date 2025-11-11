import React, {useState,useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

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
  // minWidth: 1024
  const {isDesktop} = useResponsive();
  // Data 불러오기
  const [data, setData] = useState([]);

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
      {!isDesktop && <Seasons/>}
      <Topfive rankingsData={data}/>
      {isDesktop && <HomeRegion rankingData={data}/>}
      <Footer/>
    </div>
  )
}

export default Homepage
