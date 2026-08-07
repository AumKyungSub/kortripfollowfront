import React, { useEffect, useId, useRef, useState } from 'react'
/*------------------------hooks-----------------------------------*/
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

//Page css
import './LocationDetailExplain.style.css'

const LocationDetailExplain = ({rankingData}) => {
    const {isFullMobile} = useResponsive();
    const { lang, t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const explainRef = useRef(null);
    const explainId = useId();

    const textBackImg = `${rankingData?.img?.link}3.jpg`;
    const mainText = rankingData?.description?.main?.[lang];

    useEffect(() => {
        setIsExpanded(false);
    }, [mainText]);

    useEffect(() => {
        const explainElement = explainRef.current;

        if (!explainElement) return undefined;

        const checkOverflow = () => {
            if (!isExpanded) {
                setIsOverflowing(
                    explainElement.scrollHeight > explainElement.clientHeight + 1
                );
            }
        };

        checkOverflow();

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(explainElement);

        return () => resizeObserver.disconnect();
    }, [isExpanded, mainText]);
    
    return (
        <div className='locationDetailExplainWrapper'>
            <div className='locationDetailExplainCover'>
                    <p className="preTitle14px600b54a2f">
                        <span className="preTitle14px600b54a2fLine"></span>
                        About This Place
                    </p>
                    <p className="title18px20px700">
                        {t("detailPage.location.explain.title")}
                    </p>
                <div className="locationDetailExplainTextImgCover">
                    <div 
                        className="locationDetailExplainImgCover" 
                        style={{ backgroundImage: `url(${textBackImg})` }}
                    ></div>
                    <div className="locationDetailExplainTextCover">
                        <h3 className="locationDetailExplainTitle">{rankingData?.description?.title?.[lang]}</h3>
                        <p
                            ref={explainRef}
                            id={explainId}
                            className={`locationDetailExplain${isExpanded ? ' locationDetailExplain--expanded' : ''}`}
                        >
                            {mainText}
                        </p>
                        {isOverflowing && (
                            <button
                                type="button"
                                className="locationDetailExplainMoreBtn"
                                aria-expanded={isExpanded}
                                aria-controls={explainId}
                                onClick={() => setIsExpanded((previous) => !previous)}
                            >
                                {t(isExpanded
                                    ? 'detailPage.location.explain.showLess'
                                    : 'detailPage.location.explain.showMore')}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down locationDetailExplainMoreIcon"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                        )}
                        <p className="locationDetailExplainLast subFont">{rankingData?.description?.last?.[lang]}</p>
                    </div>
                </div>
            </div>
            {isFullMobile && <div className="emptyLine"></div>}
        </div>
    )
}

export default LocationDetailExplain
