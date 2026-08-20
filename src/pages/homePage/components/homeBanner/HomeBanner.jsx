import React, {useEffect, useRef, useState} from 'react';

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './HomeBanner.style.css';

const HomeBanner = ({ 
  rankingsData = []
}) => {
  
  const navigate = useNavigate();
  
  const thumbRefs = useRef([]);
  const autoplayRef = useRef(null);
  
  const [items, setItems] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  // Device Size Hook 사용
  const {isFullMobile, isDesktop} = useResponsive();
  
  // Language Hook 사용
  const { lang, t, changeLanguage, isKo, isEn } = useLanguage();

  // return 문 안의 JSX 영역-------------------------
  // 헬퍼 모음 (추후 추가 및 수정 가능성 있음)
  // 1. 베너 이미지 경로 헬퍼
  const getImageSrc = (link) => {
    if(!link) return '';
    if(isFullMobile) return `${link}3M.jpg`
    if(isDesktop) return `${link}3.jpg`
    return `${link}3T.jpg`
  }

  // 2. homeBannerLocation 영역
  const getLocationTitle = (item) => {
    if (!item) return '';
    if (isEn) return `Attractions in ${item.address.en?.[1] || ''}`;
    return `${item.address.ko?.[0] || ''} 명소`; // 기본값: 한국어
  };
  // ----------------------------------------------

  // ---------- 초기 데이터 세팅 ----------
  useEffect(() => {
    if (!Array.isArray(rankingsData) || rankingsData.length === 0) return;

    const data = [...rankingsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6); 

    setItems(data);
  }, [rankingsData]);

  // ---------- 자동 재생 ----------
  useEffect(() => {
    if (items.length < 2) return;

    autoplayRef.current = setInterval(() => {
      if (!transitioning) handleThumbSelect(0);
    }, 6000);

    return () => clearInterval(autoplayRef.current);
  }, [items, transitioning]);

  const mainItem = items[0];
  const thumbs = items.slice(1, 5);

  // ------------유틸---------------

  const rotateItems = (selectedIndex) => {
    setItems((prev) =>
      prev.slice(selectedIndex).concat(prev.slice(0, selectedIndex))
    );
  };

  // ---------- 썸네일 클릭 ---------- 
  const handleThumbSelect = async (idx) => {
    if (transitioning || !thumbs[idx]) return;

    setTransitioning(true);

    const selectedIndex = idx + 1;
    rotateItems(selectedIndex);

    setTimeout(() => {
      setTransitioning(false);
    }, 100);
  };

  const goToLocationDetail = () => {
    if (mainItem?.id) navigate(`/location/${mainItem.id}`);
  };

  const backgroundImage = mainItem
  ? `url(${getImageSrc(mainItem.img.link)})`
  : "none";
  /* ========================================================= */

  return (
    <div className="homeBannerBackground bannerImg" style={{ backgroundImage }}>
      {/* 메인 배너 이미지 */}

    <div className="homeBannerWrapper contentWidth">
      {/* 텍스트 영역 */}
      <div className="homeBannerTextCover">
        <p className='homeBannerLocation'>
          {getLocationTitle(mainItem?.location)}
        </p>
        <hr className='homeBannerTextLine' />
        <h1 className="homeBannerName">
          {mainItem?.location?.name?.[lang] || mainItem?.location?.name?.ko}
        </h1>

        <p className="homeBannerDetail lineClamp3">
          {mainItem?.description?.slide?.[lang] || mainItem?.description?.slide?.ko}
        </p>

        <span className='homeBannerLearnMore' onClick={goToLocationDetail} style={{ cursor: "pointer" }}>
          {t("button.learnMore")}
        </span>
      </div>

      {/* 썸네일 그룹 */}
      <div className="homeBannerThumbCover">
        {thumbs.map((item, idx) => (
          <div
            key={item.id}
            className="homeBannerThumbItem"
            ref={(el) => (thumbRefs.current[idx] = el)}
            onClick={() => handleThumbSelect(idx)}
          >
            <img
              src={getImageSrc(item.img.link)}
              alt={item.location?.name?.[lang]}
            />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default HomeBanner