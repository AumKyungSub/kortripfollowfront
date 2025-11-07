import React, { useState, useEffect } from 'react'

// Components
import Header from '../Header/Header'
import SeasonCategory from './component/seasonCategory/SeasonCategory'
import SeasonBanner from './component/seasonBanner/SeasonBanner'
import SeasonList from './component/seasonList/SeasonList'
import Footer from '../footer/Footer'

// Page css
import './SeasonPage.style.css'

const SeasonPage = () => {

  const [selectedSeason, setSelectedSeason] = useState('봄'); 
  const [data, setData] = useState({ dataR: [], dataS: [] });

  useEffect(() => {
    const fetchData = async () => {
        const urlS = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/seasons`;
        const urlR = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings`;

        const responseS = await fetch(urlS);
        const responseR = await fetch(urlR);

        const dataS = await responseS.json();
        const dataR = await responseR.json();

        setData({dataR, dataS});
    };
    fetchData();
  }, []);

  const filteredListBanner = data.dataS
    .filter(selectSeason => selectSeason.season === selectedSeason)
    .sort(() => Math.random() - 0.5)
    .slice(0, 1);

  const filteredListList = data.dataR
    .filter(selectSeason => 
      selectSeason.season.includes(selectedSeason) || selectSeason.season.includes('사계절')
    )
    .sort(() => Math.random() - 0.5);    
  
  return (
    <div>
      <Header/>
        <SeasonCategory selected={selectedSeason} setSelected={setSelectedSeason} />
        {filteredListBanner.map((sea)=>(
          <SeasonBanner key={sea.id} seasonCategory={sea}/>
        ))}
        <SeasonList
          bannerList={filteredListBanner}
          list={filteredListList}
          />
      <Footer/>
    </div>
  )
}

export default SeasonPage
