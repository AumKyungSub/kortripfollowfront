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
  const getRandomLocationsByRegion = (regionName) => {
    const filtered = regionList.filter((regionInfo) => regionInfo.location?.region?.[0] === regionName);
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
                {getRandomAllLocations().map((regionNames) => (
                  <li key={regionNames?.id}>{regionNames?.location?.name}</li>
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
                {getRandomLocationsByRegion(region).map((regionNames) => (
                  <li key={regionNames?.id}>{regionNames?.location?.name}</li>
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
