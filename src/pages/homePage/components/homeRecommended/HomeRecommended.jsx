import React, {useState, useEffect} from 'react'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Components
import HomeRecommendedComponent from './HomeRecommendedComponent'

// Page Css
import './HomeRecommended.style.css'

const ITEMS_PER_PAGE = 5;

const HomeRecommended = ({
    rankingsData = [], 
    blogsData = [], 
    cafesData = [],
    restaurantsData = [],
    isFullMobile, 
    isDesktop
}) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const [eventList, setEventList] = useState([]);
    const [selectedAll, setSelectedAll] = useState(null);
    
    // 데스크탑용 (768px 이상)
    const [currentPage, setCurrentPage] = useState(1);

    // 모바일용 (767px 이하)
    const [mobilePage, setMobilePage] = useState(1);

    useEffect(() => {
        if (!Array.isArray(blogsData)) return;

        const tableMap = {
            rankings: rankingsData,
            cafes: cafesData,
            restaurants: restaurantsData,
        };

        const merged = [...blogsData]
            .sort((a, b) => b.id - a.id)  
            .map(blog => {
                const table = tableMap[blog.typeTable];
// console.log("blog :", blog);
// console.log("table :", table);
                if (!table) return null;

                const detail = table.find(
                    item => item.id === blog.otherID
                );
// console.log("detail :", detail);
                if (!detail) return null;

                return {
                    ...blog,
                    ...detail,
                    blogId: blog.id,
                };
            })
            .filter(Boolean);
// console.log(merged);
        setEventList(merged);

        if (merged.length > 0) {
            setSelectedAll(merged[0]);
        }

    }, [
        blogsData,
        rankingsData,
        cafesData,
        restaurantsData
    ]);

    /*-------------------------------------------------
    데스크탑
    -------------------------------------------------*/

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const currentItems = eventList.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(
        eventList.length / ITEMS_PER_PAGE
    );

    useEffect(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
    
        if (eventList.length > start) {
            setSelectedAll(eventList[start]);
        }
    }, [currentPage, eventList, isFullMobile]);

    /*-------------------------------------------------
    모바일
    -------------------------------------------------*/

    const type1Events = eventList.filter(
        item => item.typeTable === "rankings"
    );

    const type2Events = eventList.filter(
        item => item.typeTable === "cafes"
    );

    const type3Events = eventList.filter(
        item => item.typeTable === "restaurants"
    );
    
    const mobileItems =
        mobilePage === 1
            ? type1Events
            : mobilePage === 2
            ? type2Events
            : type3Events;
    
    useEffect(() => {
        if (!isFullMobile) return;

        if (mobileItems.length > 0) {
            setSelectedAll(mobileItems[0]);
        }
    }, [mobilePage, mobileItems, isFullMobile]);

    //-------------------------------------------------

    const handleSelect = (item) => {
        setSelectedAll(item);
    };

    /*-------------------------------------------------
    데스크탑
    -------------------------------------------------*/
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    /*-------------------------------------------------
    모바일
    -------------------------------------------------*/

    const handleMobilePrev = () => {
        setMobilePage(prev => Math.max(prev - 1, 1));
    };
    
    const handleMobileNext = () => {
        setMobilePage(prev => Math.min(prev + 1, 3));
    };

    //-------------------------------------------------

    const selectedIndex = eventList.findIndex(item => item.blogId === selectedAll?.blogId);
    const displayIndex = String(selectedIndex !== -1 ? selectedIndex + 1 : 1).padStart(2, '0');
    const displayTotal = String(eventList.length > 0 ? eventList.length : 5).padStart(2, '0');

    return (
        <section className="homeRecommendedWrapper">
            <div className="hr-header-container">
                <div className="hr-header-left">
                    <p className="hr-event-schedule">
                        <span className="hr-line-red"></span> 
                        {t("homepage.homeRecommended.title")}
                    </p>
                    <div className="hr-title-row">
                    <h2 className="hr-main-title">
                        {isFullMobile ? (
                            mobilePage === 1
                                ? t("homepage.homeRecommended.type1")
                                : mobilePage === 2
                                ? t("homepage.homeRecommended.type2")
                                : t("homepage.homeRecommended.type3")
                        ) : (
                            selectedAll?.typeTable === "rankings" ? 
                                t("homepage.homeRecommended.type1")
                            : selectedAll?.typeTable === "cafes" ? 
                                t("homepage.homeRecommended.type2")
                            : selectedAll?.typeTable === "restaurants" ? 
                                t("homepage.homeRecommended.type3")
                            :
                                <>
                                    업데이트 준비중
                                </> 
                        )
                        }
                    </h2>
                    {isFullMobile && (
                        <div className="hr-nav-buttons">
                        
                            <button
                                className="hr-nav-btn prev"
                                onClick={handleMobilePrev}
                                disabled={mobilePage === 1}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                            </button>
                    
                            <button
                                className="hr-nav-btn next"
                                onClick={handleMobileNext}
                                disabled={mobilePage === 3}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                    
                        </div>
                    )}
                    </div>
                    <p className="hr-subtitle-text">
                        {!isFullMobile && 
                                    t("homepage.homeRecommended.author") 
                        }
                    </p>
                </div>
                {!isFullMobile && (
                    <div className="hr-header-right">
                        <span className="hr-current-idx">{displayIndex}</span>
                        <span className="hr-total-idx"> / {displayTotal}</span>
                    </div>
                )}
            </div>

            <div className="homeRecommendedCards">
                {isFullMobile ? (
                    mobileItems.map((menu) => (
                        <HomeRecommendedComponent
                            key={menu.id}
                            selectedAll={menu}
                            isFullMobile={isFullMobile}
                            isDesktop={isDesktop}
                            lang={lang}
                            startIndex={startIndex}
                        />
                    ))
                ) : (
                    <HomeRecommendedComponent
                        eventList={currentItems}
                        onSelect={handleSelect}
                        selectedAll={selectedAll}
                        isFullMobile={isFullMobile}
                        isDesktop={isDesktop}
                        lang={lang}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        startIndex={startIndex}
                    />
                )}
            </div>

        </section>
    )
}

export default HomeRecommended