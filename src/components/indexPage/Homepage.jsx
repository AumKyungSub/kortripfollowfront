import React, {useState,useEffect} from 'react'

// Components
import Header from '../Header/Header'
import Banner from './components/banner/Banner'
import Topfive from './components/topfive/Topfive'
import Seasons from './components/seasons/Seasons'
import HomeRegion from './components/homeRegion/HomeRegion'
import Footer from '../footer/Footer'

const Homepage = () => {
  const [isPc, setIsPc] = useState(window.innerWidth <= 1023);
    
      // 화면 크기 변경 시 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth <= 1023);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Header />
      <Banner/>
      {isPc && <Seasons/>}
      <Topfive/>
      {!isPc && <HomeRegion/>}
      <Footer/>
    </div>
  )
}

export default Homepage
