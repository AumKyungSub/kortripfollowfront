import React from 'react'
import { useNavigate } from "react-router-dom";

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

const HomeRecommendedComponent = ({
    selectedAll,
    isFullMobile,
    isDesktop,
    eventList = [],
    onSelect,
    lang,
    onPrev,
    onNext,
    currentPage,
    totalPages,
    startIndex,
}) => {
    const navigate = useNavigate();
        const { t } = useTranslation();

    const goToLocationDetail = () => {
        if (typeof onSelect === "function") {
            onSelect(selectedAll);
        }
        window.open(selectedAll?.link?.[lang]);
    };
    
    const goToReview = (e) => {
        e.stopPropagation();
        
        if (selectedAll?.review?.link) {
            window.open(
                selectedAll.review.link,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    const addressText = lang === "ko"
        ? selectedAll?.location?.address?.ko?.[0]
        : selectedAll?.location?.address?.en?.[1];

    const bgcImgDesktop = selectedAll?.img?.link + "Review.jpg";

    return (
        <>
            {isFullMobile ? (
                <div className="homeRecommendedCard" onClick={goToReview}>
                    <div className="homeRecommendedCardImgCover">
                        <div 
                            className="hr-main-image"
                            onClick={goToReview}
                            style={{ backgroundImage: `url(${bgcImgDesktop})` }}
                        >
                            <span className="hr-tag">
                                ★{selectedAll?.stars}
                            </span>
                            <button className="hr-btn-primary-mobile" onClick={goToReview}>
                                {t("homepage.homeRecommended.goTo")}
                            </button>
                        </div>
                    </div>
                    <div className="homeRecommendedCardTextCover">
                        <div className="hr-info-en-title-cover">
                           <p>
                           {t("homepage.homeRecommended.author")}
                           </p> 
                           <p>
                            nBlog
                            </p>
                        </div>
                        <p className='homeRecommendedName'>
                            {selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}
                        </p>
                        <p className="homeRecommendedRegion subFont">
                            {
                                lang === "ko"
                                    ? selectedAll?.location?.address?.ko?.[0]
                                    : selectedAll?.location?.address?.en?.[1]
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="hr-desktop-container">
                    <div className="hr-main-content">
                        <div 
                            className="hr-main-image"
                            style={{ backgroundImage: `url(${bgcImgDesktop})` }}
                        >
                            <span className="hr-tag">
                                ★{selectedAll?.stars}
                            </span>
                        </div>
                        
                        <div className="hr-main-info">
                            <p className="hr-info-en-title">
                                nBlog
                            </p>
                            <h3 className="hr-info-ko-title">
                                {selectedAll?.location?.name?.[lang] || selectedAll?.location?.name?.ko}
                            </h3>
                            <p className="hr-info-desc">
                                {selectedAll?.typeTable === "rankings" 
                                ? selectedAll?.description?.main?.[lang] || selectedAll?.description?.main?.ko
                                : `${selectedAll?.description?.slide?.[lang] || selectedAll?.description?.slide?.ko}
                                    ${selectedAll?.description?.title?.[lang] || selectedAll?.description?.title?.ko}`
                                }
                            </p>
                            
                            <div className="hr-info-details">
                                <div className="hr-detail-row">
                                    <svg className="hr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    <div className="hr-detail-text">
                                        <span className="hr-detail-sub">
                                            {selectedAll?.date?.[lang] || selectedAll?.date?.ko}    
                                        </span>
                                    </div>
                                </div>
                                <div className="hr-detail-row">
                                    <svg className="hr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <div className="hr-detail-text">
                                        <span>
                                            {
                                                lang === "ko"
                                                    ? `${selectedAll?.location?.address?.ko?.[0]} ${selectedAll?.location?.address?.ko?.[1]}`
                                                    : `${selectedAll?.location?.address?.en?.[0]}, ${selectedAll?.location?.address?.en?.[1]}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hr-info-actions">
                                <button className="hr-btn-primary" onClick={goToReview}>
                                    {t("homepage.homeRecommended.goTo")}
                                </button>
                                {/* <button className="hr-btn-secondary">
                                        <span>
                                            dd
                                        </span>
                                </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="hr-bottom-bar">
                        <ul className="hr-thumbnail-list">
                            {eventList.map((menu, index) => {
                                const isSelected = menu.blogId === selectedAll?.blogId;
                                return (
                                    <li 
                                        key={menu.blogId || menu.id} 
                                        className={`hr-thumbnail-item ${isSelected ? 'active' : ''}`}
                                        onClick={() => onSelect(menu)}
                                    >
                                        <div className="hr-thumb-number">{String(startIndex + index + 1).padStart(2, "0")}</div>
                                        <div className="hr-thumb-title">{menu.location?.name?.[lang] || menu.location?.name?.ko}</div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="hr-nav-buttons">
                            <button className="hr-nav-btn prev" onClick={onPrev} disabled={currentPage === 1}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <button className="hr-nav-btn next" onClick={onNext} disabled={currentPage === totalPages}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HomeRecommendedComponent