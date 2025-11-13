import React from 'react'

import { useNavigate } from 'react-router-dom'

const HomeSeasonComponent = ({ img, seasons, rankingData = []}) => {
    const navigate = useNavigate();
    const goToSeason = () => {
        navigate('/season', { state: { selectedSeason: seasons } });
    }
    const seasonCount = rankingData.filter(item =>
        item.season.includes(seasons) || item.season.includes('사계절')
    ).length;
    return (
        <>
            <div className="homeSeasonCover" onClick={goToSeason} style={{backgroundImage: `url(images/seasons/${img}1.jpg)`}}>
                <div className="homeSeasonImgCover">
                    <img src={`/images/icon/${img}Icon.png`} alt="시즌" />
                </div>
                <h3 className="homeSeasons">{seasons} 여행</h3>
                <p className="homeSeasonsP">{seasonCount}개의 여행지</p>
            </div>   
        </>
    )
}

export default HomeSeasonComponent
