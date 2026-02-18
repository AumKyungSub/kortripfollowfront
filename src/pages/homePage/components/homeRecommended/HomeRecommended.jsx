import React, {useState, useEffect} from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import HomeRecommendedComponent from './HomeRecommendedComponent'

// Page Css
import './HomeRecommended.style.css'

const HomeRecommended = ({rankingsData = [], isFullMobile, isDesktop}) => {
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
        <section className="homeRecommendedWrapper">
            <h2>{t("homepage.homeRecommended.title")}</h2>

            <div className="homeRecommendedCards">
                {isFullMobile ? (
                    rankingList.map((menu) => (
                        <HomeRecommendedComponent
                            key={menu.id}
                            selectedAll={menu}
                            isFullMobile={isFullMobile}
                            isDesktop={isDesktop}
                            lang={lang}
                        />
                    ))
                ) : (
                    <HomeRecommendedComponent
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
    )
}

export default HomeRecommended