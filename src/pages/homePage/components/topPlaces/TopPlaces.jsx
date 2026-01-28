import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';

import TopPlacesComponent from './TopPlacesComponent';
import './TopPlaces.style.css'

const TopPlaces = ({rankingsData = [], isMobile, isFullMobile, isDesktop}) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const [rankingList, setRankingList] = useState([]);
    const [selectedAll, setSelectedAll] = useState(null);

    useEffect(() => {
        if (!Array.isArray(rankingsData)) return;

        const topFive = rankingsData
            .filter(topRanking => topRanking?.top >= 1 && topRanking?.top <= 5)
            .sort((a, b) => a.top - b.top);

        setRankingList(topFive);
        if (topFive.length > 0) {
            setSelectedAll(topFive[0]);
        }
    }, [rankingsData]);

    const handleSelect = (clickCard) => {
        setSelectedAll(clickCard);
    };

    return (
        <section className="topPlaces">
            {isFullMobile && <h3 className='homePageCateTitle'>{t("homepage.topPlaces.title")}</h3>}

            <div className="cards">
                <div className="cardsTitle768">
                    {!isFullMobile && <h3 className='homePageCateTitle'>{t("homepage.topPlaces.title")}</h3>}
                </div>

                {isFullMobile ? (
                    rankingList.map((menu) => (
                        <TopPlacesComponent
                            key={menu.id}
                            selectedAll={menu}
                            isMobile={isMobile}
                            isFullMobile={isFullMobile}
                            isDesktop={isDesktop}
                            lang={lang}
                        />
                    ))
                ) : (
                    <TopPlacesComponent
                        key={rankingList.id}
                        rankingList={rankingList}
                        onSelect={handleSelect}
                        selectedAll={selectedAll}
                        isDesktop={isDesktop}
                        lang={lang}
                    />
                )}
            </div>
        </section>
    );
};

export default TopPlaces;
