import { useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useResponsive } from "@/shared/hooks/useResponsive";
import { useLanguage } from "@/shared/hooks/useLanguage";
import SearchModal from "@/widgets/searchModal/SearchModal";
import "./HomeBanner.style.css";

const HomeBanner = ({ rankingsData = [] }) => {
  const navigate = useNavigate();
  const { isFullMobile } = useResponsive();
  const { lang, t } = useLanguage();
  const swiperRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useMediaQuery({
    query: "(prefers-reduced-motion: reduce)",
  });
  const items = useMemo(() => {
    const candidates = (Array.isArray(rankingsData) ? rankingsData : [])
      .filter((item) => !["tourApi", "manual"].includes(item?.source))
      .filter((item) => item?.visibility === true && item?.img?.link);
    // Select three once per data load; keep slide order stable during navigation.
    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [candidates[index], candidates[other]] = [
        candidates[other],
        candidates[index],
      ];
    }
    return candidates.slice(0, 3);
  }, [rankingsData]);
  const getImageSrc = (item) => `${item.img.link}3.jpg`;
  const getTitle = (item) => {
    const address = item.location?.address?.[lang];
    const region =
      lang === "ko" && Array.isArray(address)
        ? address[0]
            ?.split(/\s+/)
            .at(-1)
            ?.replace(/[시군]$/, "")
        : item.location?.region?.[lang];
    return [region, item.location?.name?.[lang] || item.location?.name?.ko]
      .filter(Boolean)
      .join(" ");
  };
  const openPlanner = () =>
    window.dispatchEvent(
      new CustomEvent("kortrip:open-auth", {
        detail: { redirectPath: "/myTravel?tab=courses" },
      }),
    );
  const toggleAutoplay = () => {
    const autoplay = swiperRef.current?.autoplay;
    if (paused) autoplay?.start();
    else autoplay?.stop();
    setPaused(!paused);
  };
  return (
    <section className="homeHero">
      <div className="homeHeroLayout contentWidth">
        <div className="homeHeroIntro">
          <p className="preTitle14px600b54a2f">
            <span className="preTitle14px600b54a2fLine" aria-hidden="true" />
            {t("homeHero.preTitle")}
          </p>
          <h2 className="title28px40px700">{t("homeHero.title")}</h2>
          <p className="homeHeroDescription">{t("homeHero.description")}</p>
          <div className="homeHeroSearch">
            {isFullMobile ? (
              <button
                type="button"
                className="homeHeroSearchTrigger"
                onClick={() => setSearchOpen(true)}
              >
                <span aria-hidden="true">⌕</span>
                {t("homeHero.searchPlaceholder")}
              </button>
            ) : (
              <SearchModal
                embedded
                onClose={() => {}}
                placeholder={t("homeHero.searchPlaceholder")}
              />
            )}
          </div>
          <div className="homeHeroActions">
            <button type="button" onClick={() => navigate("/region")}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z" />
                <circle cx="12" cy="9" r="2" />
              </svg>
              {t("homeHero.explore")}
              <span aria-hidden="true">›</span>
            </button>
            <button type="button" onClick={openPlanner}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M7 2v6M17 2v6M3 11h18M7 15h4" />
              </svg>
              {t("homeHero.plan")}
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
        <div className="homeHeroPhoto">
          {items.length ? (
            <>
              <Swiper
                modules={[A11y, Autoplay, Keyboard, Pagination]}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onAutoplayStop={() => setPaused(true)}
                onAutoplayStart={() => setPaused(false)}
                slidesPerView={1}
                speed={reducedMotion ? 0 : 500}
                rewind
                keyboard={{ enabled: true, onlyInViewport: true }}
                autoplay={
                  !reducedMotion && items.length > 1
                    ? {
                        delay: 6000,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                pagination={{ clickable: true }}
                a11y={{
                  paginationBulletMessage: t("homeHero.slideLabel", {
                    index: "{{index}}",
                  }),
                }}
                aria-label={t("homeHero.slides")}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={item.id}>
                    <button
                      type="button"
                      className="homeHeroSlide"
                      onClick={() => navigate(`/location/${item.id}`)}
                    >
                      <img
                        src={getImageSrc(item)}
                        alt=""
                        fetchPriority={index === 0 ? "high" : "auto"}
                      />
                      <span className="homeHeroCaption">
                        <span className="homeHeroSlideDescription lineClamp1">
                          {item.description?.slide?.[lang] ||
                            item.description?.slide?.ko}
                        </span>
                        <strong className="lineClamp1">{getTitle(item)}</strong>
                      </span>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    className="homeHeroArrow homeHeroPrevious"
                    aria-label={t("homeHero.previous")}
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="homeHeroArrow homeHeroNext"
                    aria-label={t("homeHero.next")}
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    ›
                  </button>
                  {!reducedMotion && (
                    <button
                      type="button"
                      className="homeHeroPause"
                      aria-label={t(
                        paused ? "homeHero.play" : "homeHero.pause",
                      )}
                      onClick={toggleAutoplay}
                    >
                      {paused ? "▶" : "Ⅱ"}
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="homeHeroEmpty">{t("homeHero.empty")}</div>
          )}
        </div>
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </section>
  );
};
export default HomeBanner;
