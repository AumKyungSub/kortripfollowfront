import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';

// Components
import Header from '../Header/Header'
import RegionBanner from './component/regionBanner/RegionBanner'
import Category from './component/Category/Category'
import RegionList from './component/regionList/RegionList'
import RegionCount from './component/regionCount/RegionCount'
import RegionBottom from './component/regionBottom/RegionBottom'
import Footer from '../footer/Footer'


// Page css
import './Region.style.css'

const Region = () => {
    const location = useLocation(); // ✅ HomeRegion에서 navigate로 전달한 state 받기
    const initialRegion = location.state?.selectedRegion || '전체'; // ✅ 전달된 지역이 없으면 '전체'

     // Data 불러오기
    const [data, setData] = useState([]);
    // const [selectedRegion, setSelectedRegion] = useState('전체'); // 선택된 지역
    const [selectedRegion, setSelectedRegion] = useState(initialRegion);
    const [isPc, setIsPc] = useState(window.innerWidth <= 1023);

    // Data 불러오기 처리
    useEffect(() => {
      const fetchData = async () => {
        const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
        const response = await fetch(url);
        const db = await response.json();
        setData(db);
        
        //HomeRegion.jsx 에서 넘어온 state
        if (location.state?.selectedRegion) {
          setSelectedRegion(location.state.selectedRegion);
        }
      };
      fetchData();
    },[location.state]);

  // 선택된 지역에 따라 필터링
    const filteredList = (selectedRegion === '전체'
        ? data
        : data?.filter(selectRegion => selectRegion?.region === selectedRegion)
    ).sort(() => Math.random() - 0.5);
        
    // 화면 크기 변경 시 모바일 여부 감지
    useEffect(() => {
        const handleResize = () => setIsPc(window.innerWidth <= 1023);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div>
        <Header/>
        <div className="emptyLine1px"></div>
        {!isPc && <RegionBanner filteredList={filteredList} />}
        <Category selected={selectedRegion} setSelected={setSelectedRegion} isPc={isPc} />
        <RegionCount selectedRegion={selectedRegion} filteredList={filteredList} isPc={isPc} />
        <div className="regionListWholeCover">
          {filteredList.map((reg)=>(
            <RegionList key={reg.id} regionList={reg}/>
          ))}
        </div>
        <RegionBottom/>
        <Footer/>
    </div>
  )
}

export default Region
