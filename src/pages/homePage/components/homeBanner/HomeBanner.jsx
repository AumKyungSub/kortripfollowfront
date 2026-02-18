import React, {useEffect, useRef, useState} from 'react';

// (hook) Navigate
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Page css
import './HomeBanner.style.css';

const HomeBanner = ({ rankingsData, isFullMobile, isDesktop, lang }) => {

  const {t} = useTranslation();
  
  const getImageSrc = (link) =>
  isFullMobile
    ? link + "3M.jpg"
    : isDesktop
    ? link + "3.jpg"
    : link + "3T.jpg";

  const bannerRef = useRef(null);
  const thumbRefs = useRef([]);
  const autoplayRef = useRef(null);

  const [items, setItems] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const isKorean = lang.startsWith('ko');

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

  /* ========================================================= */

  return (
    <div className="homeBannerWrapper">
      {/* 메인 배너 이미지 */}
      <div ref={bannerRef} className="homeMainBannerCover">
        {mainItem && (
          <img
            className="mainBannerImg"
            src={getImageSrc(mainItem.img.link)}
            alt={mainItem.location?.name?.[lang]}
          />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="homeBannerTextCover">
        <p className='homeBannerLocation'>
          {isKorean
          ?
            `${mainItem?.location?.address?.ko?.[0]} 명소`
          :
            `Attractions in ${mainItem?.location?.address?.en?.[1]}`
          }
        </p>
        <hr className='homeBannerTextLine' />
        <h1 className="homeBannerName">
          {mainItem?.location?.name?.[lang] || mainItem?.location?.name?.ko}
        </h1>

        <p className="homeBannerDetail">
          {mainItem?.description?.slide?.[lang] || mainItem?.description?.slide?.ko}
        </p>

        <span className='homeBannerLearnMore' onClick={goToLocationDetail} style={{ cursor: "pointer" }}>
          {t("homepage.button.learnMore")}
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
  );
};

export default HomeBanner