import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// (hook) languages
import { useTranslation } from 'react-i18next'
// (custom hook) Read DB
import { useReadDB } from '@/shared/api/useReadDB'

//Function Component
import Loading from '@/features/loading/Loading'

// Components
import Header from '@/widgets/header/Header'
import EmptyHeader from '@/widgets/emptyHeader/EmptyHeader'
import SeasonCategory from '@/pages/seasonPage/components/seasonCategory/SeasonCategory'
import SeasonBanner from '@/pages/seasonPage/components/seasonBanner/SeasonBanner'
import SeasonList from '@/pages/seasonPage/components/seasonList/SeasonList'
import Footer from '@/widgets/footer/Footer'

// Page css
import './SeasonPage.style.css'

const SeasonPage = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const {isFullMobile} = useResponsive();
  const location = useLocation();
  const initialSeason = location.state?.selectedSeason || 'SPRING'
  const [selectedSeason, setSelectedSeason] = useState(initialSeason); 

    // Custom Hook Read Data
    const {data, loading, error} = useReadDB();
    const { rankings, seasons } = data;
    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>

  const filteredListBanner = seasons
    .filter(item => item.season === selectedSeason)
    .sort(() => Math.random() - 0.5)
    .slice(0, 1);

  const filteredListList = rankings
    .filter(item =>
      item.season.includes(selectedSeason) || item.season.includes("ALL")
    )
    .sort(() => Math.random() - 0.5);
  
  return (
    <div>
      <Header/>
      {!isFullMobile && <EmptyHeader/>}
        <SeasonCategory selected={selectedSeason} setSelected={setSelectedSeason} lang={lang} />
        {filteredListBanner.map((sea)=>(
          <SeasonBanner key={sea.id} seasonCategory={sea} lang={lang}/>
        ))}
        <SeasonList
          bannerList={filteredListBanner}
          list={filteredListList}
          lang={lang}
          />
      <Footer/>
    </div>
  )
}

export default SeasonPage
