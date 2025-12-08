import React from 'react'

import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom'

const HomeSeasonComponent = ({ img, seasons, seasonCode, rankingData = []}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const goToSeason = () => {
        navigate('/season', { state: { selectedSeason: seasonCode } });
    };

    const seasonCount = rankingData.filter(item =>
        item.season?.includes(seasonCode) || item.season?.includes("ALL")
    ).length;

    return (
        <>
            <div className="homeSeasonCover" onClick={goToSeason} style={{backgroundImage: `url(images/seasons/${img}1.jpg)`}}>
                <div className="homeSeasonImgCover">
                <img src={`/images/icon/${img}Icon.png`} alt={seasons} />
                </div>
                <h3 className="homeSeasons">{seasons} {t("homeSeason.homeSeasonTravel")}</h3>
                <p className="homeSeasonsP">{seasonCount} {t("homeSeason.homeSeasonCount")}</p>
            </div>   
        </>
    )
}

export default HomeSeasonComponent
