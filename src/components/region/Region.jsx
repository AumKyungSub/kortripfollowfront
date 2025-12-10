import React, {useEffect, useState} from 'react'
// (hook) Get Navigate State
import { useLocation } from 'react-router-dom';
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed';

import { useTranslation } from 'react-i18next';

//Function Component
import Loading from '../functionComponents/Loading';

// Components
import Header from '../Header/Header'
import EmptyHeader from '../commonComponents/emptyHeader/EmptyHeader';
import ListBanner from '../commonComponents/listBanner/ListBanner';
import ListCategory from '../commonComponents/listCategory/ListCategory';
import ListCount from '../commonComponents/listCount/ListCount';
import List from '../commonComponents/list/List';
import Bottom from '../commonComponents/bottom/Bottom';
import Footer from '../footer/Footer'

// Page css
import './Region.style.css'

const regionNameMap = {
  ALL: { ko: "전체", en: "All" },
  SEOUL: { ko: "서울", en: "Seoul" },
  GGICN: { ko: "경기/인천", en: "Gyeonggi/Incheon" },
  GANGWON: { ko: "강원", en: "Gangwon" },
  CCDAEJEON: { ko: "충청/대전", en: "Chungcheong" },
  GSBUSANDAEGUULSAN: { ko: "경상/부산/대구/울산", en: "Gyeongsang/Busan" },
  JRGWANGJU: { ko: "전라/광주", en: "Jeolla/Gwangju" },
  JEJU: { ko: "제주", en: "Jeju" }
};

const Region = () => {
  // 언어
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { 
    isFullMobile /* minWidth: 1024 */
  } = useResponsive();

  // HomeRegion.jsx에서 navigate로 가져온 regionName값 담기
  const locations = useLocation(); 
  // HomeRegion.jsx에서 가져온 값 담기
  const [selectedRegion, setSelectedRegion] = useState('ALL');

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
        const url = `${import.meta.env.VITE_API_URL}/rankings`;
        const response = await fetch(url);
        const db = await response.json();
        setData(db);
        //HomeRegion.jsx 에서 넘어온 state
      if (locations.state?.selectedRegionCode) {
        setSelectedRegion(locations.state.selectedRegionCode);
      }
      } catch (err) {
        console.error("데이터 에러", err);
        setError(t("common.error"));
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
  if (!data || data.length === 0) return <div>{t("common.noData")}</div>;

  // 선택된 지역에 따라 필터링
  const filteredList =
  selectedRegion === 'ALL'
    ? [...data].sort(() => Math.random() - 0.5)
    : [...data]
        .filter(item => item?.location?.region?.code === selectedRegion)
        .sort(() => Math.random() - 0.5);

  const regionNameText = regionNameMap[selectedRegion]?.[lang] || "";

  const regionOptions = Object.entries(regionNameMap).map(([code, label]) => ({
  code,
  label,
}));

  return (
    <div>
        <Header/>
        {!isFullMobile && <EmptyHeader/>}
        {!isFullMobile && 
          <ListBanner 
            type="region" 
            images ={filteredList} 
          />
        }
        <ListCategory
          options={regionOptions}
          selected={selectedRegion}
          setSelected={setSelectedRegion}
          lang={lang}
          isFullMobile={isFullMobile}
          useI18n={false}
        />
        <ListCount 
          title={`${regionNameText} ${t("regionPage.titleSuffix")}`} 
          count={t("regionPage.totalCount", { count: filteredList.length })} 
          countM={filteredList.length} 
          isFullMobile={isFullMobile}
        />
        <List filteredList={filteredList} link="location"/>
        <Bottom 
          title={t("regionPage.bottomTitle")}
          text={t("regionPage.bottomText")}
          leftTitle={t("regionPage.bottomLeftTitle")}
          leftText={t("regionPage.bottomLeftPlace")}
          rightTitle={t("regionPage.bottomRightTitle")}
          rightText={t("regionPage.bottomRightText")}
        />
        <Footer/>
    </div>
  )
}

export default Region
