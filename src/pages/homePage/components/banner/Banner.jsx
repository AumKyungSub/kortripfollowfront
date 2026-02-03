import React, { useEffect, useRef, useState } from "react";

// (hook) Navigate
import { useNavigate } from "react-router-dom";

import { useTranslation } from 'react-i18next';

// Page css
import "./Banner.style.css";

const Banner = ({ rankingsData, isMobile, isFullMobile, isDesktop, lang }) => {

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
      .slice(0, 5); 

    setItems(data);
  }, [rankingsData]);

  // ---------- 자동 재생 ----------
  useEffect(() => {
    if (items.length < 2) return;

    autoplayRef.current = setInterval(() => {
      if (!transitioning) handleThumbSelect(0);
    }, 4500);

    return () => clearInterval(autoplayRef.current);
  }, [items, transitioning]);

  const mainItem = items[0];
  const thumbs = items.slice(1, 5);

  // ---------- 썸네일 클릭 처리 ----------
const animateThumbToBanner = async (thumbEl, bannerEl) => {
  const thumbRect = thumbEl.getBoundingClientRect();
  const bannerRect = bannerEl.getBoundingClientRect();

  const scaleX = bannerRect.width / thumbRect.width;
  const scaleY = bannerRect.height / thumbRect.height;

  thumbEl.style.position = "fixed";
  thumbEl.style.left = `${thumbRect.left}px`;
  thumbEl.style.top = `${thumbRect.top}px`;
  thumbEl.style.width = `${thumbRect.width}px`;
  thumbEl.style.height = `${thumbRect.height}px`;
  thumbEl.style.zIndex = 100;
  thumbEl.classList.add("thumbFly");

  await delay(80);

  thumbEl.style.transform = `
    translate(${bannerRect.left - thumbRect.left}px, ${bannerRect.top - thumbRect.top}px)
    scale(${scaleX * 1.03}, ${scaleY * 1.03})
  `;
  thumbEl.style.opacity = "0";
};

const rotateItems = (selectedIndex) => {
  setItems((prev) =>
    prev.slice(selectedIndex).concat(prev.slice(0, selectedIndex))
  );
};

const cleanupThumb = (thumbEl) => {
  thumbEl.classList.remove("thumbFly");
  thumbEl.style = "";
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const handleThumbSelect = async (idx) => {
  if (transitioning || !thumbs[idx]) return;

  const thumbEl = thumbRefs.current[idx];
  const bannerEl = bannerRef.current;
  if (!thumbEl || !bannerEl) return;

  setTransitioning(true);

  const selectedIndex = idx + 1;

  await animateThumbToBanner(thumbEl, bannerEl);

  setTimeout(() => rotateItems(selectedIndex), 450);

  setTimeout(() => {
    cleanupThumb(thumbEl);
    setTransitioning(false);
  }, 900);
};

  const goToLocationDetail = () => {
    if (mainItem?.id) navigate(`/location/${mainItem.id}`);
  };

  return (
    <div className="bannerWrapper">
      {/* 메인 배너 이미지 */}
      <div ref={bannerRef} className="mainBannerArea">
        {mainItem && (
          <img
            className="mainBannerImg fadeInMain"
            src={getImageSrc(mainItem.img.link)}
            alt={mainItem.location?.name?.[lang]}
          />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="bannerTextWrapper">
        <h1 className='bannerLocation'>
          {isKorean
          ?
            `${mainItem?.location?.address?.ko?.[0]} 명소`
          :
            `Attractions in ${mainItem?.location?.address?.en?.[1]}`
          }
        </h1>
        <hr className='bannerTextLine' />
        <h2 className="bannerTextH2">
          {mainItem?.location?.name?.[lang] || mainItem?.location?.name?.ko}
        </h2>

        <p className="bannerTextP1">
          {mainItem?.description?.slide?.[lang] || mainItem?.description?.slide?.ko}
        </p>

        <span className='learnMore' onClick={goToLocationDetail} style={{ cursor: "pointer" }}>
          {t("homepage.button.learnMore")}
        </span>
      </div>

      {/* 썸네일 그룹 */}
      <div className="thumbContainer">
        {thumbs.map((item, idx) => (
          <div
            key={item.id}
            className="thumbItem"
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

export default Banner;
