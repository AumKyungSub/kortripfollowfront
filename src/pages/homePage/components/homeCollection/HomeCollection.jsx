import React, { useState, useEffect, useCallback } from 'react'

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
// Collection List
import { useCollectionList } from '@/shared/hooks/useCollectionList'
/*------------------------/custom hooks-----------------------------------*/

import './HomeCollection.style.css'

const HomeCollection = () => {
    const navigate = useNavigate();
    // Language 사용
    const {lang, t} = useLanguage();
    // Collection List 사용
    const { collections } = useCollectionList({ lang });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (collections.length <= 1) return;

        const timer = setInterval(() => {

            const next = (currentIndex + 1) % collections.length;

            setNextIndex(next);
            setFade(true);

            setTimeout(() => {
                setCurrentIndex(next);
                setFade(false);
            }, 800);

        }, 3500);

        return () => clearInterval(timer);

    }, [currentIndex, collections.length]);

    const goToCollection = useCallback(() => {
        navigate("/collection");
    }, [navigate]);

    if (!collections.length) return null;

    const currentCollection = collections[currentIndex];
    const nextCollection = collections[nextIndex] || currentCollection;
    const episodeNumber = String(currentCollection.id).padStart(3, "0");
    const nextEpisodeNumber = String(nextCollection.id).padStart(3, "0");
    const episodeLength = String(collections.length).padStart(3, "0");

    return (
        <section className="homeCollectionBackground">
            <div
                className="homeCollectionWrapper"
            >
                {/* 현재 배경 */}
                <div
                    className="homeCollectionBg current"
                    style={{
                        backgroundImage: `url('${collections[currentIndex].img}.jpg')`
                    }}
                />

                {/* 다음 배경 */}
                <div
                    className={`homeCollectionBg next ${fade ? "show" : ""}`}
                    style={{
                        backgroundImage: `url('${nextCollection.img}.jpg')`
                    }}
                />

                <div className="homeCollectionOverlay" />

                <div className="homeCollectionInner contentWidth">
                    <div className="homeCollectionContent">
                        <span className="homeCollectionSub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-images-icon lucide-images"><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/></svg>
                            COLLECTION
                            <span className="homeCollectionSubDivider" aria-hidden="true" />
                            <span className="homeCollectionStory">
                                Story Gallery -&nbsp;
                                <span className="homeCollectionStoryNumber">
                                    <span className={`current ${fade ? "hide" : ""}`}>{episodeNumber}</span>
                                    <span className={`next ${fade ? "show" : ""}`} aria-hidden={!fade}>{nextEpisodeNumber}</span>
                                </span>
                                &nbsp;/ {episodeLength}
                            </span>
                        </span>
                        <div className="homeCollectionTextCover">
                            <p className="homeCollectionEpisode">
                                <span className={`homeCollectionEpisodeValue current ${fade ? "hide" : ""}`}>
                                    EP. {episodeNumber} <span aria-hidden="true">—</span> {currentCollection.title}
                                </span>
                                <span className={`homeCollectionEpisodeValue next ${fade ? "show" : ""}`} aria-hidden={!fade}>
                                    EP. {nextEpisodeNumber} <span aria-hidden="true">—</span> {nextCollection.title}
                                </span>
                            </p>
                            <h2 className="homeCollectionTitle">
                                {t("collection.banner.textFst")}
                            </h2>
                            <p className="homeCollectionDesc">
                                {t("collection.banner.textSnd")}
                            </p>
                        </div>

                        <div className="homeCollectionFooter">
                            <button type="button" className="homeCollectionBtn" onClick={goToCollection}>
                                {t("button.collection")}
                                <span className="homeCollectionBtnArrow" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeCollection
