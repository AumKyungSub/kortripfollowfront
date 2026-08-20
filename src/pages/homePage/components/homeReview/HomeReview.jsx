import React, {useState, useEffect} from 'react'

/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Components
import PaginationMethodTwo from '@/widgets/paginationMethodTwo/PaginationMethodTwo';

// Items per Page
const itemsPerPage = 5; 

// Page CSS
import './HomeReview.style.css'

const HomeReview = ({
    rankingsData = [],
    blogsData = [],
    cafesData = [],
    restaurantsData = []
}) => {
    
    const [eventList, setEventList] = useState([]);
    const [selectedAll, setSelectedAll] = useState(null);

    // 인덱스 계산
    const selectedIndex = eventList.findIndex(item => item.blogId === selectedAll?.blogId);
    const displayIndex = String(selectedIndex !== -1 ? selectedIndex + 1 : 1).padStart(2, '0');
    const displayTotal = String(eventList.length > 0 ? eventList.length : 5).padStart(2, '0');

    // Device Size Hook 사용
    const {isFullMobile, isDesktop} = useResponsive();
    // Language Hook 사용
    const {lang, t, isKo, isEn} = useLanguage();
    
    /*-------------- 데이터 병합(Merge) blogs + (rankings || cafes || restaurants) --------------*/
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
                if (!table) return null;

                const detail = table.find(
                    item => item.id === blog.otherID
                );
                if (!detail) return null;

                return {
                    ...blog,
                    ...detail,
                    blogId: blog.id,
                };
            })
            .filter(Boolean);
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
    /*-----------------------------------------------------------------------------------------*/

    /*------------------------------- 데스크탑 페이지네이션 & 선택 --------------------------------*/
    const [currentPage, setCurrentPage] = useState(1);
    
    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentItems = eventList.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const totalPages = Math.ceil(
        eventList.length / itemsPerPage
    );

    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
    
        if (eventList.length > start) {
            setSelectedAll(eventList[start]);
        }
    }, [currentPage, eventList, isFullMobile]);
    // Pagination
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
    /*-----------------------------------------------------------------------------------------*/

    /*-------------------------------- 모바일 페이지네이션 & 필터링 ---------------------------------*/
    const [mobilePage, setMobilePage] = useState(1);
    
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
    // Pagination
    const handleMobilePrev = () => {
        setMobilePage(prev => Math.max(prev - 1, 1));
    };

    const handleMobileNext = () => {
        setMobilePage(prev => Math.min(prev + 1, 3));
    };
    /*-----------------------------------------------------------------------------------------*/

    /*--------------------------------- 이벤트 핸들러 -------------------------------------------*/
    const handleSelect = (item) => setSelectedAll(item);

    const goToReview = (e, item) => {
        e?.stopPropagation();
        const targetLink = item?.review?.link || selectedAll?.review?.link;
        if (targetLink) {
            window.open(targetLink, '_blank', 'noopener,noreferrer');
        }
    };
    /*-----------------------------------------------------------------------------------------*/

    // return 문 안의 JSX 영역-------------------------
    // 헬퍼 모음 (추후 추가 및 수정 가능성 있음)
    // 1. 배경 이미지
    const bgcImg = selectedAll?.img?.link ? `${selectedAll.img.link}Review.jpg` : '';
    // 2. Title28px40px700 영역
    const getHeaderTitle = () => {
        const typeTitleMap = {
            rankings: t('title.homeReviewType1'),
            cafes: t('title.homeReviewType2'),
            restaurants: t('title.homeReviewType3'),
        };

        const mobileTitleMap = {
            1: t('title.homeReviewType1'),
            2: t('title.homeReviewType2'),
            3: t('title.homeReviewType3'),
        };

        if (isFullMobile) {
            return mobileTitleMap[mobilePage] || '';
        }
        return typeTitleMap[selectedAll?.typeTable] || '업데이트 준비중';
    };
    //3. homeReviewRegion (모바일), homeReviewBodyTopInfoDetail 영역
    const getLocationAddress = (item, isState = false) => {
        if (!item?.location?.address) return '';

        if (isEn) {
            const others = item.location.address.en?.[0] || '';
            const state = item.location.address.en?.[1] || '';
            if (isState) return state; // 모바일용 짧은 주소
            return state ? `${others}, ${state}` : others;
        }

        // 기본값: 한국어
        const state = item.location.address.ko?.[0] || '';
        const others = item.location.address.ko?.[1] || '';
        if (isState) return state; // 모바일용 짧은 주소
        return `${state} ${others}`.trim();
    };
    // ----------------------------------------------

    return (
        <section className="homeReviewWrapper contentWidth">
            {/* 헤더 영역 */}
            <div className="homeReviewHeaderCover">
                <div className="homeReviewHeaderLeft">
                    <p className="preTitle14px600b54a2f">
                        <span className="preTitle14px600b54a2fLine"></span>
                        {t('preTitle.homeReview')}
                    </p>
                    <div className="homeReviewTitleCover">
                        <h2 className="title28px40px700">
                            {getHeaderTitle()}
                        </h2>

                        {/* 모바일 네비게이션 버튼 */}
                        {isFullMobile && (
                            <PaginationMethodTwo 
                                prev={handleMobilePrev} 
                                next={handleMobileNext} 
                                prevDis={mobilePage === 1} 
                                nextDis={mobilePage === 3}
                                extraClassName="homeReviewMobilePagination"
                            />
                        )}
                    </div>
                    <p className="homeReviewAuthorBy">
                        {!isFullMobile && t('homepage.homeReview.author')}
                    </p>
                </div>

                {/* 데스크탑 인덱스 표시 */}
                {!isFullMobile && (
                    <div className="homeReviewHeaderRight">
                        <span className="homeReviewCurrentIDX">{displayIndex}</span>
                        <span className="homeReviewTotalIDX"> / {displayTotal}</span>
                    </div>
                )}
            </div>

            {/* 카드 / 컨텐츠 영역 */}
            <div className="homeReviewCardCover">
                {isFullMobile ? (
                    /* 모바일 뷰: 카드 리스트 출력 */
                    mobileItems.map((menu) => {
                        const cardBg = menu?.img?.link ? `${menu.img.link}Review.jpg` : '';
                        return (
                            <div
                                key={menu.blogId || menu.id}
                                className="homeReviewCard"
                                onClick={(e) => goToReview(e, menu)}
                            >
                                <div className="homeReviewCardImgCover">
                                    <div
                                        className="homeReviewImg"
                                        style={{ backgroundImage: `url(${cardBg})` }}
                                    >
                                        <span className="homeReviewStars">★ {Number(menu?.stars).toFixed(1)}</span>
                                        <button
                                            className="homeReviewGoToBtn"
                                            onClick={(e) => goToReview(e, menu)}
                                        >
                                            {t('button.viewReview')}
                                        </button>
                                    </div>
                                </div>
                                <div className="homeReviewCardTextCover">
                                    <div className="homeReviewAuthorCover">
                                        <p>{t('homepage.homeReview.author')}</p>
                                        <p>nBlog</p>
                                    </div>
                                    <p className="homeReviewRegionName lineClamp1">
                                        {menu?.location?.name?.[lang] || menu?.location?.name?.ko}
                                    </p>
                                    <p className="homeReviewAddress subFont">
                                        {getLocationAddress(menu, true)}
                                    </p>
                                </div>
                            </div>
                        );
                })
                ) : (
                    /* 데스크탑 뷰: 메인 상세 영역 + 썸네일 리스트 */
                    <div className="homeReviewBodyCover">
                        <div className="homeReviewBodyTopCover">
                            <div
                                className="homeReviewImg"
                                style={{ backgroundImage: `url(${bgcImg})` }}
                            >
                                <span className="homeReviewStars">★ {Number(selectedAll?.stars).toFixed(1)}</span>
                            </div>

                            <div className="homeReviewBodyTopText">
                                <p className="homeReviewBlogName">nBlog</p>
                                <h3 className="homeReviewRegionName lineClamp1">
                                    {selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}
                                </h3>
                                <p className="homeReviewBodyTopDesc lineClamp2">
                                    {selectedAll?.typeTable === 'rankings'
                                        ? selectedAll?.description?.main?.[lang] || selectedAll?.description?.main?.ko
                                        : `${selectedAll?.description?.slide?.[lang] || selectedAll?.description?.slide?.ko}\n${selectedAll?.description?.title?.[lang] || selectedAll?.description?.title?.ko}`}
                                </p>

                                <div className="homeReviewBodyTopInfoCover">
                                    <div className="homeReviewBodyTopInfo">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                                        <div className="homeReviewBodyTopInfoDetail">
                                            <span className="homeReviewBodyTopInfoDetailDate">
                                                {selectedAll?.date?.[lang] || selectedAll?.date?.ko}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="homeReviewBodyTopInfo">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                                        <div className="homeReviewBodyTopInfoDetail lineClamp1">
                                            <span>
                                                {getLocationAddress(selectedAll)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="homeReviewGoToBtnCover">
                                    <button className="homeReviewGoToBtn" onClick={(e) => goToReview(e, selectedAll)}>
                                        {t('button.viewReview')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* 하단 썸네일 바 & 데스크탑 이전/다음 버튼 */}
                        <div className="homeReviewBodyBottomCover">
                            <ul className="homeReviewBodyBottomList">
                                {currentItems.map((menu, index) => {
                                    const isSelected = menu.blogId === selectedAll?.blogId;
                                    return (
                                        <li
                                            key={menu.blogId || menu.id}
                                            className={`homeReviewBodyBottomListItem ${isSelected ? 'active' : ''}`}
                                            onClick={() => handleSelect(menu)}
                                        >
                                            <div>
                                                {String(startIndex + index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="lineClamp1">
                                                {menu.location?.name?.[lang] || menu.location?.name?.ko}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <PaginationMethodTwo 
                                prev={handlePrev} 
                                next={handleNext} 
                                prevDis={currentPage === 1} 
                                nextDis={currentPage === totalPages}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )   
}   

export default HomeReview