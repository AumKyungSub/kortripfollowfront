import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCollectionList } from '@/shared/hooks/useCollectionList'

import './HomeCollection.style.css'

const HomeCollection = () => {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const lang = i18n.language === "ko" ? "ko" : "en";
    const { collections } = useCollectionList({ lang });

    const [currentIndex, setCurrentIndex] = useState(0);

    // 3초마다 자동 슬라이드
    useEffect(() => {
        if (collections.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % collections.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [collections.length]);

    const goToCollection = useCallback(() => {
        navigate('/collection');
    }, [navigate]);

    if (!collections.length) return null;

    return (
        <section className="homeCollectionWrapper" onClick={goToCollection}>
            {/* 슬라이드 배경 이미지들 */}
            {collections.map((item, index) => (
                <div
                    key={item.id}
                    className={`homeCollectionBg${index === currentIndex ? ' homeCollectionBgActive' : ''}`}
                    style={{ backgroundImage: `url('${item.img}.jpg')` }}
                />
            ))}

            {/* 어두운 오버레이 */}
            <div className="homeCollectionOverlay" />

            {/* 글래스모피즘 텍스트 박스 */}
            <div className="homeCollectionContent">
                <p className="homeCollectionSub">COLLECTION</p>
                <h2 className="homeCollectionTitle">
                    {t("collection.banner.textFst")}
                </h2>
                <p className="homeCollectionDesc">
                    {t("collection.banner.textSnd")}
                </p>
                <span className="homeCollectionBtn clickBtnCover">
                    {t("collection.banner.title")} →
                </span>
            </div>
        </section>
    )
}

export default HomeCollection
