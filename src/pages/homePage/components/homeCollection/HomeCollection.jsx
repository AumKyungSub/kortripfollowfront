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

    return (
        <section
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
                    backgroundImage: `url('${collections[nextIndex].img}.jpg')`
                }}
            />

            <div className="homeCollectionOverlay" />

            <div className="homeCollectionInner">
                <div className="homeCollectionContent">
                    <span className="homeCollectionSub">
                        <img src="/images/icon/collectionIconS.png" alt="collectionIconS" />
                        COLLECTION
                    </span>
                
                    <h2 className="homeCollectionTitle">
                        {t("collection.banner.textFst")}
                    </h2>
                
                    <p className="homeCollectionDesc">
                        {t("collection.banner.textSnd")}
                    </p>
                
                    <span 
                        className="homeCollectionBtn"
                        onClick={goToCollection}
                        >
                        {t("collection.banner.title")} →
                    </span>
                </div>
            </div>
        </section>
    )
}

export default HomeCollection
