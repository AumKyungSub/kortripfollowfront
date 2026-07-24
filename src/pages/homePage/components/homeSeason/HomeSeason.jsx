import React from 'react'

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './HomeSeason.style.css'

const seasonMap = {
    SPRING: { ko: "봄", en: "Spring" },
    SUMMER: { ko: "여름", en: "Summer" },
    FALL: { ko: "가을", en: "Fall" },
    WINTER: { ko: "겨울", en: "Winter" }
};

const HomeSeason = ({rankingData = []}) => {
    const navigate = useNavigate();
    
    // Language 사용
    const {lang, t} = useLanguage();
    
        
    // 클릭 이벤트 핸들러: code를 인자로 받도록 변경
    const handleGoToSeason = (code) => {
        navigate('/season', { state: { selectedSeason: code } });
    };

    // 계절별 개수 계산 함수
    const getSeasonCount = (code) => {
        return rankingData.filter(item =>
            item.season?.includes(code) || item.season?.includes("ALL")
        ).length;
    };
    return (
        <>
            <section className='homeSeasonWrapper'>
                <p className="preTitle14px600b54a2f">
                    <span className="preTitle14px600b54a2fLine"></span>
                    {t('preTitle.homeSeason')}
                </p>
                <h2 className='title28px40px700'>
                    {t("title.homeSeason")}
                </h2>
                <div className="homeSeasonCover">
                    {Object.entries(seasonMap).map(([code, name]) => {
                        const seasonCount = getSeasonCount(code);

                        return (
                            <div 
                                key={code}
                                className="homeSeasonTextCover" 
                                onClick={() => handleGoToSeason(code)} 
                                style={{ backgroundImage: `url(/images/seasons/${code.toLowerCase()}2.jpg)` }}
                            >
                                <div className="homeSeasonImgCover">
                                    <img 
                                        src={`/images/icon/${code.toLowerCase()}Icon.png`} 
                                        alt={name[lang] || name.ko} 
                                    />
                                </div>
                                <h3 className="homeSeasonTitle">{name[lang] || name.ko}</h3>
                                <p className="homeSeasonsCount">
                                    {seasonCount} {t("homeSeason.homeSeasonCount")}
                                </p>
                            </div> 
                        );
                    })}
                </div>
            </section>
        </>
    )
}

export default HomeSeason
