import React from 'react'

// Component
import HomeSeasonComponent from './HomeSeasonComponent'

// Page css
import './HomeSeason.style.css'

const HomeSeason = ({rankingData = []}) => {
    return (
        <>
            <section className='homeSeasonWholeCover'>
                <h2 className='homeSeasonH2'>계절별 여행지</h2>
                <div className="homeSeasonAllCover">
                    <HomeSeasonComponent img={"spring"} seasons={"봄"} rankingData={rankingData}/>
                    <HomeSeasonComponent img={"summer"} seasons={"여름"}  rankingData={rankingData}/>
                    <HomeSeasonComponent img={"fall"} seasons={"가을"}  rankingData={rankingData}/>
                    <HomeSeasonComponent img={"winter"} seasons={"겨울"}  rankingData={rankingData}/>
                </div>
            </section>
        </>
    )
}

export default HomeSeason
