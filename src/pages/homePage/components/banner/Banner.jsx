import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Page css
import "./Banner.style.css";

const Banner = ({ rankingsData = [], isMobile, isFullMobile, isDesktop }) => {
  const { i18n } = useTranslation(); // 🌍 현재 언어 가져오기

  const bannerRef = useRef(null);
  const thumbRefs = useRef([]);
  const autoplayRef = useRef(null);

  const [items, setItems] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

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
      if (!transitioning) handleThumbSelect(0, true);
    }, 4500);

    return () => clearInterval(autoplayRef.current);
  }, [items, transitioning]);

  const mainItem = items[0];
  const thumbs = items.slice(1, 5);

  // ---------- 썸네일 클릭 처리 ----------
  const handleThumbSelect = async (thumbIdx) => {
    if (transitioning || !thumbs[thumbIdx]) return;

    setTransitioning(true);

    const thumbEl = thumbRefs.current[thumbIdx];
    const bannerEl = bannerRef.current;
    if (!thumbEl || !bannerEl) {
      setTransitioning(false);
      return;
    }

    const selectedIndex = thumbIdx + 1;

    const thumbRect = thumbEl.getBoundingClientRect();
    const bannerRect = bannerEl.getBoundingClientRect();

    const scaleX = bannerRect.width / thumbRect.width;
    const scaleY = bannerRect.height / thumbRect.height;

    thumbEl.style.position = "fixed";
    thumbEl.style.left = thumbRect.left + "px";
    thumbEl.style.top = thumbRect.top + "px";
    thumbEl.style.width = thumbRect.width + "px";
    thumbEl.style.height = thumbRect.height + "px";
    thumbEl.style.zIndex = 100;
    thumbEl.classList.add("thumbFly");

    await new Promise((res) => setTimeout(res, 80));

    thumbEl.style.transform = `
      translate(${bannerRect.left - thumbRect.left}px, ${bannerRect.top - thumbRect.top}px)
      scale(${scaleX * 1.03}, ${scaleY * 1.03})
    `;
    thumbEl.style.opacity = "0";

    setTimeout(() => {
      const selectedItem = items[selectedIndex];
      if (selectedItem) {
        setItems((prev) => {
          const rotated = prev.slice(selectedIndex).concat(prev.slice(0, selectedIndex));
          return rotated;
        });
      }
    }, 250);

    setTimeout(() => {
      thumbEl.classList.remove("thumbFly");
      thumbEl.style = "";
      setTransitioning(false);
    }, 900);
  };

  const goToLocationDetail = () => {
    if (mainItem?.id) navigate(`/location/${mainItem.id}`);
  };

  return (
    <div className="bannerWrapper">
      {/* 메인 배너 이미지 */}
      <div ref={bannerRef} className="mainBannerArea" onClick={goToLocationDetail} style={{ cursor: "pointer" }}>
        {mainItem && (
          <img
            className="mainBannerImg fadeInMain"
            src={
              isFullMobile
                ? mainItem.img.link + "3M.jpg"
                : isDesktop
                ? mainItem.img.link + "3.jpg"
                : mainItem.img.link + "3T.jpg"
            }
            alt={mainItem.location?.name?.[i18n.language]}
          />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="bannerTextWrapper" onClick={goToLocationDetail} style={{ cursor: "pointer" }}>
        <h2 className="bannerTextH2">
          {mainItem?.location?.name?.[i18n.language] || mainItem?.location?.name?.ko}
        </h2>

        <p className="bannerTextP1">
          {mainItem?.description?.slide?.[i18n.language] || mainItem?.description?.slide?.ko}
        </p>

        {!isMobile && (
          <p className="bannerTextP2">
            {mainItem?.description?.last?.[i18n.language] || mainItem?.description?.last?.ko}
          </p>
        )}
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
              src={
                isFullMobile
                  ? item.img.link + "3M.jpg"
                  : isDesktop
                  ? item.img.link + "3.jpg"
                  : item.img.link + "3T.jpg"
              }
              alt={item.location?.name?.[i18n.language]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
