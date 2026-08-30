import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import EmptyFooter from "@/widgets/emptyHeader/EmptyFooter";
import MobileNavigation from "@/widgets/mobileNavigation/MobileNavigation";
import DetailMap from "@/widgets/detailMap/DetailMap";
import DetailReview from "@/widgets/detailReview/DetailReview";
import DetailVideo from "@/widgets/detailVideo/DetailVideo";
import Loading from "@/features/loading/Loading";
import FavoriteButton from "@/features/favoriteButton/FavoriteButton";
import ShareBtn from "@/widgets/shareBtn/ShareBtn";
import { memberApi, placeImageUrl } from "@/shared/api/memberApi";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { useResponsive } from "@/shared/hooks/useResponsive";
import "./ExternalPlaceDetailPage.style.css";

const THEME_PLACE_TYPES = new Set([
  "cafe",
  "restaurant",
  "lodging",
  "food",
  "market",
  "park",
  "ocean",
  "drive",
]);

const ExternalPlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang, isEn } = useLanguage();
  const { isFullMobile } = useResponsive();
  const descriptionRef = useRef(null);
  const [state, setState] = useState({ loading: true, data: null });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    let active = true;
    memberApi(`/external-places/${id}`)
      .then((data) => active && setState({ loading: false, data }))
      .catch(() => active && setState({ loading: false, data: null }));
    return () => {
      active = false;
    };
  }, [id]);

  const place = state.data;
  const detail =
    place?.description?.detail?.[lang] || place?.description?.detail?.ko || "";

  useEffect(() => {
    setIsExpanded(false);
  }, [detail]);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || isExpanded) return undefined;
    const checkOverflow = () =>
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [detail, isExpanded]);

  if (state.loading) return <Loading />;
  if (!place)
    return (
      <>
        <Header />
        <main className="externalPlaceState contentWidth">
          <p>
            {isEn
              ? "This place is unavailable."
              : "공개 장소를 찾을 수 없습니다."}
          </p>
          <button onClick={() => navigate(-1)}>
            {isEn ? "Go back" : "돌아가기"}
          </button>
        </main>
        <Footer />
      </>
    );

  const name = place.location?.name?.[lang] || place.location?.name?.ko;
  const region = place.location?.region?.[lang] || place.location?.region?.ko;
  const address =
    place.location?.address?.[lang]?.[0] || place.location?.address?.ko?.[0];
  const shortDescription =
    place.description?.short?.[lang] || place.description?.short?.ko;
  const image = placeImageUrl(place);
  const hasTourApiImage = Boolean(place.img?.originalUrl || place.img?.link);
  const homepage = place.officialLinks?.homepage;
  const instagram = place.officialLinks?.instagram;
  const hasLinks = Boolean(homepage || instagram);
  const activeMenuKey = THEME_PLACE_TYPES.has(place.placeType) ? "theme" : "region";

  const linkContent = (
    <div className="externalPlaceLinkIcons">
      {homepage && (
        <a href={homepage} target="_blank" rel="noopener noreferrer">
          <img src="/images/icon/homepageIcon.png" alt="" />
          <span>{isEn ? "Website" : "홈페이지"}</span>
        </a>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer">
          <img src="/images/logo/instaIcon.png" alt="" />
          <span>Instagram</span>
        </a>
      )}
      {!hasLinks && (
        <p>
          {isEn
            ? "No official links are registered."
            : "등록된 공식 채널이 없습니다."}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Header activeMenuKey={activeMenuKey} />
      <main className="externalPlacePage">
        <div className="externalPlaceContent">
          <section className="externalPlaceHero">
            <div className="externalPlaceHeroImage">
              <img src={image} alt={name} />
            </div>
            <div className="externalPlaceHeroText">
              <p className="externalPlaceRegion">{region}</p>
              <h1>{name}</h1>
              <p className="externalPlaceAddress">{address}</p>
              <p className="externalPlaceSummary">{shortDescription}</p>
              <div className="externalPlaceHeroActions">
                <FavoriteButton
                  placeType={place.placeType}
                  placeId={place.id}
                />
                <ShareBtn
                  title={name}
                  text={shortDescription || address}
                  variant="inverse"
                />
              </div>
            </div>
          </section>

          <div className="externalPlaceDetailGrid">
            <div className="externalPlaceMainColumn">
              <section className="externalPlaceAbout">
                <div className="externalSectionHeading">
                  <p className="preTitle14px600b54a2f">
                    <span className="preTitle14px600b54a2fLine"></span>
                    About This Place
                  </p>
                  <p className="title18px20px700">
                    {t("detailPage.location.explain.title")}
                  </p>
                </div>
                <h3>{place.description?.title?.[lang] || name}</h3>
                <p
                  ref={descriptionRef}
                  className={`externalPlaceDescription${isExpanded ? " expanded" : ""}`}
                >
                  {detail}
                </p>
                {isOverflowing && (
                  <button
                    className="externalPlaceMore"
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setIsExpanded((value) => !value)}
                  >
                    {isExpanded
                      ? isEn
                        ? "Show less"
                        : "접기"
                      : isEn
                        ? "Read more"
                        : "더보기"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down-icon lucide-chevron-down externalMoreIcon"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}
              </section>
              <section className="externalPlaceLinks externalPlaceLinksDesktop">
                <div className="externalSectionHeading">
                  <p className="preTitle14px600b54a2f">
                    <span className="preTitle14px600b54a2fLine"></span>
                    Links
                  </p>
                  <p className="title18px20px700">
                    {t("detailPage.common.link.title")}
                  </p>
                </div>
                {linkContent}
              </section>
              <DetailVideo
                video={null}
                data={place}
                isFullMobile={isFullMobile}
                variant="feature"
                pendingDescription={isEn
                  ? "Once the operator visits this place, we’ll return with a unique Kukttara page of our own."
                  : "운영자가 장소를 방문 후 국트따라만의 페이지로 다시 찾아올게요."}
              />
            </div>

            <aside className="externalPlaceSideColumn">
              <DetailMap data={place} showParkingInfo={false} />
              <section className="externalPlaceLinks externalPlaceLinksMobile">
                <div className="externalSectionHeading">
                  <p className="preTitle14px600b54a2f">
                    <span className="preTitle14px600b54a2fLine"></span>
                    Links
                  </p>
                  <p className="title18px20px700">
                    {t("detailPage.common.link.title")}
                  </p>
                </div>
                {linkContent}
              </section>
              <DetailReview
                data={place}
                typeTable="external_places"
                isFullMobile={false}
              />
            </aside>
          </div>

          {place.source === "tourApi" && <aside className="externalPlaceCredit">
            <strong>
              {hasTourApiImage
                ? (isEn ? "Image and travel information source" : "사진 및 관광정보 출처")
                : (isEn ? "Travel information source" : "관광정보 출처")}
            </strong>
            <span>{place.attribution?.provider || "한국관광공사 TourAPI"}</span>
            {hasTourApiImage && <span>
              {isEn ? "KOGL Type 1 · Attribution" : "공공누리 제1유형 · 출처표시"}{" "}
              ({place.attribution?.license || "KOGL-1"})
            </span>}
          </aside>}
        </div>
      </main>
      <Footer />
      {isFullMobile && <EmptyFooter />}
      {isFullMobile && <MobileNavigation />}
    </>
  );
};

export default ExternalPlaceDetailPage;
