import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'; 

// Page css
import './HomeRegion.style.css'

const HomeRegion = ({rankingData = []}) => {
  const [regionList, setRegionList] = useState([]);
  const [regionCount, setRegionCount] =useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(rankingData) || rankingData.length === 0) return;

    setRegionList(rankingData);

    // 지역별 개수 계산
    const counts = rankingData.reduce((count, regionName) => {
      const region = regionName.location?.region[0] || "기타";
      count[region] = (count[region] || 0) + 1;
      return count;
    }, {});

    setRegionCount(counts);
  }, [rankingData]);

  // 해당 지역의 랜덤 최대 3개 데이터 반환 함수
  const getRandomLocationsByRegion = (regionName) => 
    regionList.filter((regionInfo) => regionInfo.location?.region?.[0] === regionName)
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
  

  // 전체를 위해 다시 불러옴..
  const getRandomAllLocations = () => 
    [...regionList].sort(() => Math.random() - 0.5)
                  .slice(0, 3);

  // 지역 목록 배열 (코드 반복 줄이기)
  const regions = ["전체", "서울", "경기/인천", "강원", "충청/대전", "경상/부산/대구/울산", "전라/광주", "제주"];

  const goToRegion = (regionName) => {
    // regionName 값 state로 보내기 (useLocation)
    navigate('/region', { state: { selectedRegion: regionName } });
  };

  return (
    <div className="homeRegionBackground">
      <div className='homeRegionWholeCover'>
        <h3>지역별 여행지</h3>
        <div className="homeRegionCover">
          {regions.map((region,index) => (
            <div key={region} className="homeRegionList" onClick={() => goToRegion(region)}>
            <img src={`/images/regionBackground/regionBackground${index + 1}.jpg`} alt={`/images/regionBackground/regionBackground${index + 2}.jpg`} />
              <div className="homeRegionListHeader">
                <span className='listHeaderFstSpan'>
                  <img src="/images/icon/regionIconS.png" alt="regionIconS" />
                  {region}
                </span>
                <span className='listHeaderSndSpan'>{region === "전체"?regionList.length : regionCount[region] || 0}곳</span>
              </div>
              <div className="regionExampleList">
                <p className='regionArea'>{region}</p>
                <div className="regionAreaListCover">
                  {region === "전체"?
                    getRandomAllLocations().map((regionNames) => (
                      <span key={regionNames?.id} className='regionAreaList'>{regionNames?.location?.name}</span>
                    ))
                    :
                    getRandomLocationsByRegion(region).map((regionNames) => (
                      <span key={regionNames?.id} className='regionAreaList'>{regionNames?.location?.name}</span>
                    ))
                  }
                </div>
                <p className='regionLooking'>여행지 둘러보기</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeRegion
