import React, { useEffect, useRef, useState } from "react";

// Page css
import "./Banner.style.css";

const Banner = ({ rankingsData = [], isMobile, isFullMobile, isDesktop }) => {
  const bannerRef = useRef(null);
  const thumbRefs = useRef([]);
  const autoplayRef = useRef(null);

  // items: 길이 5, 항상 [메인, 썸네일1, 썸네일2, 썸네일3, 썸네일4]
  const [items, setItems] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  // ---------- 초기 세팅 ----------
  useEffect(() => {
    if (!Array.isArray(rankingsData) || rankingsData.length === 0) return;

    const data = [...rankingsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // A,B,C,D,E

    setItems(data);
  }, [rankingsData]);

  // ---------- 자동 재생 (6초마다 한 칸 회전) ----------
  useEffect(() => {
    if (items.length < 2) return;

    autoplayRef.current = setInterval(() => {
      if (!transitioning) {
        // 썸네일 0번(B)을 메인으로 보내기 → 한 칸 회전
        handleThumbSelect(0, true);
      }
    }, 6000);

    return () => clearInterval(autoplayRef.current);
  }, [items, transitioning]);

  // 메인 / 썸네일 파생값
  const mainItem = items[0];
  const thumbs = items.slice(1, 5); // 항상 4개

  // ---------- 썸네일 선택(클릭 & 자동 공용) ----------
  // thumbIdx: 0~3 (thumbs 기준 index), isAuto: 자동 여부(애니는 똑같이)
  const handleThumbSelect = async (thumbIdx, isAuto = false) => {
    if (transitioning) return;
    if (!thumbs[thumbIdx]) return;

    setTransitioning(true);

    const thumbEl = thumbRefs.current[thumbIdx];
    const bannerEl = bannerRef.current;
    if (!thumbEl || !bannerEl) {
      setTransitioning(false);
      return;
    }

    // 실제 items 배열에서 선택되는 인덱스 = thumbIdx + 1
    const selectedIndex = thumbIdx + 1; // B,C,D,E 중 하나

    const thumbRect = thumbEl.getBoundingClientRect();
    const bannerRect = bannerEl.getBoundingClientRect();

    const finalW = bannerRect.width;
    const finalH = bannerRect.height;

    const scaleX = finalW / thumbRect.width;
    const scaleY = finalH / thumbRect.height;

    const targetX = bannerRect.left;
    const targetY = bannerRect.top;

    // 고정 위치로 변환
    thumbEl.style.position = "fixed";
    thumbEl.style.left = thumbRect.left + "px";
    thumbEl.style.top = thumbRect.top + "px";
    thumbEl.style.width = thumbRect.width + "px";
    thumbEl.style.height = thumbRect.height + "px";
    thumbEl.style.zIndex = 100;

    thumbEl.classList.add("thumbFly");

    // 살짝 딜레이 후 애니 시작
    await new Promise((res) => setTimeout(res, 80));

    thumbEl.style.transform = `
      translate(${targetX - thumbRect.left}px, ${targetY - thumbRect.top}px)
      scale(${scaleX * 1.03}, ${scaleY * 1.03})
    `;
    thumbEl.style.opacity = "0"; // A 방식: 시작하자마자 사라짐

    // 메인 이미지 교체 (조금 후)
    setTimeout(() => {
      const selectedItem = items[selectedIndex];
      if (!selectedItem) return;

      // 메인을 선택된 아이템으로 바꾸고,
      // 순서를 "선택된 아이템부터 시작"으로 회전
      // 예: [A,B,C,D,E], selectedIndex=1(B)
      //  → [B,C,D,E,A]
      setItems((prev) => {
        const current = [...prev];
        if (!current[selectedIndex]) return current;
        const rotated = current
          .slice(selectedIndex)
          .concat(current.slice(0, selectedIndex));
        return rotated;
      });
    }, 350);

    // 애니 끝난 후 정리
    setTimeout(() => {
      thumbEl.classList.remove("thumbFly");
      thumbEl.style = "";
      setTransitioning(false);
    }, 900);
  };

  return (
    <div className="bannerWrapper">
      {/* 메인 배너 */}
      <div ref={bannerRef} className="mainBannerArea">
        {mainItem && (
          <>
          <img
            className="mainBannerImg fadeInMain"
            src={
              isFullMobile
              ? mainItem.img.link + "3M.jpg"
              : isDesktop
              ? mainItem.img.link + "3.jpg"
              : mainItem.img.link + "3T.jpg"
            }
            alt={mainItem.location?.name || "main"}
            />
          </>
        )}
      </div>

      <div className="bannerTextWrapper">
          <h2 className='bannerTextH2'>{mainItem?.location?.name}</h2>
          <h3 className='bannerTextH3'>{mainItem?.location?.english}</h3>
          <p className="bannerTextP1">{mainItem?.description?.slide}</p>
          {!isMobile && <p className="bannerTextP2">{mainItem?.description?.last}</p>
          }
      </div>

      {/* 썸네일 4개 */}
      <div className="thumbContainer">
        {thumbs.map((item, idx) => (
          <div
            key={item.id}
            className="thumbItem"
            ref={(el) => (thumbRefs.current[idx] = el)}
            onClick={() => handleThumbSelect(idx, false)}
          >
            <img
              src={
                isFullMobile
                  ? item.img.link + "3M.jpg"
                  : isDesktop
                  ? item.img.link + "3.jpg"
                  : item.img.link + "3T.jpg"
              }
              alt={item.location?.name || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
