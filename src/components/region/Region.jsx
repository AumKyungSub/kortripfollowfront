import React, {useEffect, useState} from 'react'
// (hook) Get Navigate State
import { useLocation } from 'react-router-dom';
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed';

//Function Component
import Loading from '../functionComponents/Loading';

// Components
import Header from '../Header/Header'
import RegionBanner from './component/regionBanner/RegionBanner'
import Category from './component/Category/Category'
import RegionList from './component/regionList/RegionList'
import RegionCount from './component/regionCount/RegionCount'
import Bottom from '../commonComponents/bottom/Bottom';
import Footer from '../footer/Footer'

// Page css
import './Region.style.css'

const Region = () => {
  // HomeRegion.jsx에서 navigate로 가져온 regionName값 담기
  const locations = useLocation(); 
  // HomeRegion.jsx에서 가져온 값 담기
  const [selectedRegion, setSelectedRegion] = useState('전체');
  // minWidth: 1024
  const {isFullMobile, isDesktop} = useResponsive();
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
        const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
        const response = await fetch(url);
        const db = await response.json();
        setData(db);
        //HomeRegion.jsx 에서 넘어온 state
        if (locations.state?.selectedRegion) {
          setSelectedRegion(locations.state.selectedRegion);
        }
      } catch (err) {
        console.error("데이터 에러", err);
        setError("데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[locations.state]);

  // 로딩 화면
  if (loading) return <div><Loading/></div>
  // 에러 화면
  if (error) return <div>{error}</div>
  // 데이터 없을때 화면
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

  // 선택된 지역에 따라 필터링
  const filteredList = (selectedRegion === '전체'
      ? data
      : data?.filter(selectRegion => selectRegion?.location?.region?.[0] === selectedRegion)
      ).sort(() => Math.random() - 0.5);

  return (
    <div>
        <Header/>
        <div className="emptyLine1px"></div>
        {!isFullMobile && <RegionBanner filteredList={filteredList} />}
        <Category selected={selectedRegion} setSelected={setSelectedRegion} isFullMobile={isFullMobile} />
        <RegionCount selectedRegion={selectedRegion} filteredList={filteredList} isFullMobile={isFullMobile} />
        <div className="regionListWholeCover">
          {filteredList.map((reg)=>(
            <RegionList key={reg.id} regionList={reg}/>
          ))}
        </div>
        <Bottom 
            title={"대한민국의 매력"}
            text={"대한민국은 사계절의 뚜렷한 변화와 함께 각 지역마다 독특한 문화와 자연경관을 자랑합니다. 북쪽의 산악지대부터 남쪽의 아름다운 해안선까지, 다양한 매력을 가진 여행지들이 여러분을 기다립니다."}
            leftText={"부석사"}
            rightTitle={"추천 계절"}
            rightText={"사계절"}
        />
        <Footer/>
    </div>
  )
}

export default Region
