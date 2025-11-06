import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'; 

// Page css
import './HomeRegion.style.css'

const HomeRegion = () => {
  const [regionList, setRegionList] = useState([]);
  const [regionCount, setRegionCount] =useState([]);
  const navigate = useNavigate();

  const getRanking = async () => {
    try{      
      // let url = `http://localhost:3000/rankings`;
      let url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;
      let response = await fetch(url);
      let data = await response.json();
      // console.log(data);
      setRegionList(data);
     
      const counts = data.reduce((acc, item)=>{
        const region = item.region || "기타";
        acc[region] = (acc[region] || 0) +1;
        return acc;
      },{});

      setRegionCount(counts);
    } catch (error) {
      console.error("데이터를 불러올 수 없습니다.",error);
    }
  };
  
  useEffect(()=>{
    getRanking()
  },[]);

  // 해당 지역의 랜덤 최대 3개 데이터 반환 함수
  const getRandomLocationsByRegion = (regionName) => {
    const filtered = regionList.filter((item) => item.region === regionName);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };
  // 전체를 위해 다시 불러옴..
  const getRandomAllLocations = () => {
    const shuffled = [...regionList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  // 전체 개수
  const totalCount = regionList.length;

  // 지역 목록 배열 (코드 반복 줄이기)
  const regions = ["서울", "경기도", "강원도", "충청도", "경상도", "전라도", "제주도"];

  const goToRegion = (regionName) => {
    navigate('/region', { state: { selectedRegion: regionName } });
  };

  return (
    <div className="homeRegionBackground">
      <div className='homeRegionWholeCover'>
        <h3>지역별 여행지</h3>
        {regionList.id}
        <div className="homeRegionCover">

          <div className="homeRegionList" onClick={() => goToRegion("전체")}>
            <img src="/images/regionBackground/regionBackground1.jpg" alt="ALL" />
            <div className="homeRegionListHeader">
              <span className='listHeaderFstSpan'>
                <img src="/images/icon/regionIconS.png" alt="regionIconS" />
                전체
              </span>
              <span className='listHeaderSndSpan'>{totalCount}곳</span>
            </div>
            <ul className="regionExampleList">
              <p>전체</p>
                {getRandomAllLocations().map((item) => (
                  <li key={item.id}>{item.location}</li>
                ))}
            </ul>
          </div>

          {regions.map((region,index) => (
            <div key={region} className="homeRegionList" onClick={() => goToRegion(region)}>
            <img src={`/images/regionBackground/regionBackground${index + 2}.jpg`} alt={`/images/regionBackground/regionBackground${index + 2}.jpg`} />
              <div className="homeRegionListHeader">
                <span className='listHeaderFstSpan'>
                  <img src="/images/icon/regionIconS.png" alt="regionIconS" />
                  {region}
                </span>
                <span className='listHeaderSndSpan'>{regionCount[region] || 0}곳</span>
              </div>
              <ul className="regionExampleList">
                <p>{region}</p>
                {getRandomLocationsByRegion(region).map((item) => (
                  <li key={item.id}>{item.location}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeRegion
