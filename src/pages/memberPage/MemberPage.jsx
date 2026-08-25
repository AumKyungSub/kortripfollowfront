import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Map as KakaoMap,
  MapMarker,
  CustomOverlayMap,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { useLanguage } from "@/shared/hooks/useLanguage";
import {
  ApiError,
  memberApi,
  placeImageUrl,
  placePath,
} from "@/shared/api/memberApi";
// Device Size
import { useResponsive } from "@/shared/hooks/useResponsive";
// Pagination
import { usePagination } from "@/shared/hooks/usePagination";

// Components
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import Pagination from "@/widgets/pagination/Pagination";
import ListCategory from "@/widgets/listCategory/ListCategory";

// Page css
import "./MemberPage.style.css";

const emptyCourse = {
  title: "",
  description: "",
  visibility: "private",
  dateMode: "fixed",
  durationDays: 1,
  date: "",
  endDate: "",
  editPassword: "",
  selected: [],
};
const emptyVisit = {
  placeKey: "",
  visitedAt: new Date().toISOString().slice(0, 10),
  rating: "",
  memo: "",
};

const copy = {
  ko: {
    eyebrow: "MY KORTRIP",
    title: "내 여행",
    subtitle: "찜한 장소를 지도에서 보고 여행 코스와 방문 기록을 관리하세요.",
    favorites: "내 찜",
    courses: "여행 코스",
    joinedCourses: "공유 코스",
    joinedCoursesTitle: "공유 코스",
    emptyJoinedCourse: "공유하거나 공유받은 코스가 없습니다.",
    sharedByMe: "내가 공유",
    sharedWithMe: "공유 받음",
    visits: "방문 기록",
    login: "로그인이 필요한 페이지입니다.",
    loginHint: "오른쪽 위 프로필 버튼에서 소셜 로그인을 진행해 주세요.",
    emptyFavorite: "아직 찜한 장소가 없습니다.",
    emptyCourse: "아직 만든 여행 코스가 없습니다.",
    emptyVisit: "아직 방문 기록이 없습니다.",
    createCourse: "코스 저장",
    updateCourse: "수정 저장",
    createVisit: "방문 기록 저장",
    updateVisit: "수정 저장",
    cancel: "취소",
    remove: "삭제",
    edit: "수정",
    titleLabel: "코스 이름",
    description: "설명",
    visibility: "공개 범위",
    date: "여행 날짜",
    places: "코스에 담을 찜 장소",
    selectRegion: "지역 선택",
    allRegions: "전체 지역",
    emptyCourseRegion: "이 지역에는 찜한 장소가 없어요",
    place: "장소",
    rating: "평점",
    memo: "메모",
    visitDate: "방문 날짜",
    private: "비공개",
    unlisted: "링크 공개",
    public: "전체 공개",
    publicVisibilityTitle: "Public (공개)",
    publicVisibilityDescription:
      "모든 사용자가 이 코스를 검색하고 볼 수 있습니다.",
    unlistedVisibilityTitle: "Link-only (링크 공개)",
    unlistedVisibilityDescription:
      "링크를 가진 사람만 이 코스를 볼 수 있습니다.",
    privateVisibilityTitle: "Private (비공개)",
    privateVisibilityDescription: "나만 이 코스를 볼 수 있습니다.",
    map: "찜 지도",
    noMap: "지도에 표시할 장소가 없습니다.",
    loadError: "데이터를 불러오지 못했습니다.",
    saveError: "저장하지 못했습니다.",
    open: "상세 보기",
    share: "링크 복사",
    copied: "복사됨",
    selectPlace: "장소를 선택하세요",
    searchPlace: "장소명·지역·주소 검색",
    noPlaceResult: "검색 결과가 없습니다.",
    favoriteView: "찜 목록 보기 방식",
    defaultView: "기본 보기",
    groupByRegion: "지역별 그룹",
    unknownRegion: "기타 지역",
    emptyRegion: "이 지역에는 추가된 장소가 없어요",
    courseNamePlaceholder: "예: 서울 역사 문화 투어",
    descriptionPlaceholder: "코스에 대한 간단한 설명을 입력하세요",
    editPassword: "함께 편집 비밀번호",
    editPasswordPlaceholder: "4~32자 비밀번호",
    editPasswordHint:
      "해당 비밀번호를 아는 사람들과 함께 계획 수정이 가능합니다.",
    startDate: "여행 시작일",
    endDate: "여행 종료일",
    dateStatus: "여행 날짜",
    dateFixed: "날짜 확정",
    dateFlexible: "날짜 미확정",
    tripDays: "여행 일수",
    savedCourses: "저장된 코스",
    courseSortLabel: "코스 정렬 기준",
    sortByTravelDate: "날짜순",
    sortByTitle: "이름순",
    noDescription: "코스 설명이 없습니다.",
    visitMemoPlaceholder: "방문 소감이나 팁을 남겨보세요",
    chooseRating: "선택",
    visitHistory: "방문 기록",
  },
  en: {
    eyebrow: "MY KORTRIP",
    title: "My trip",
    subtitle:
      "See saved places on the map and manage itineraries and visit history.",
    favorites: "Saved",
    courses: "Itineraries",
    joinedCourses: "Shared courses",
    joinedCoursesTitle: "Shared courses",
    emptyJoinedCourse: "No courses shared by or with you yet.",
    sharedByMe: "Shared by me",
    sharedWithMe: "Shared with me",
    visits: "Visits",
    login: "Please sign in to use this page.",
    loginHint:
      "Use the profile button in the top-right corner to continue with social login.",
    emptyFavorite: "No saved places yet.",
    emptyCourse: "No itineraries yet.",
    emptyVisit: "No visits yet.",
    createCourse: "Save itinerary",
    updateCourse: "Save changes",
    createVisit: "Save visit",
    updateVisit: "Save changes",
    cancel: "Cancel",
    remove: "Delete",
    edit: "Edit",
    titleLabel: "Title",
    description: "Description",
    visibility: "Visibility",
    date: "Travel date",
    places: "Saved places in this itinerary",
    selectRegion: "Select region",
    allRegions: "All regions",
    emptyCourseRegion: "There are no saved places in this region.",
    place: "Place",
    rating: "Rating",
    memo: "Memo",
    visitDate: "Visited on",
    private: "Private",
    unlisted: "Unlisted",
    public: "Public",
    publicVisibilityTitle: "Public",
    publicVisibilityDescription: "Anyone can find and view this itinerary.",
    unlistedVisibilityTitle: "Link-only",
    unlistedVisibilityDescription:
      "Only people with the link can view this itinerary.",
    privateVisibilityTitle: "Private",
    privateVisibilityDescription: "Only you can view this itinerary.",
    map: "Saved places map",
    noMap: "There are no places to show.",
    loadError: "Could not load your data.",
    saveError: "Could not save changes.",
    open: "View details",
    share: "Copy link",
    copied: "Copied",
    selectPlace: "Select a place",
    searchPlace: "Search by place, region, or address",
    noPlaceResult: "No places found.",
    favoriteView: "Saved places view",
    defaultView: "Default view",
    groupByRegion: "Group by region",
    unknownRegion: "Other regions",
    emptyRegion: "There are no saved places in this region.",
    courseNamePlaceholder: "e.g. Seoul history and culture tour",
    descriptionPlaceholder: "Add a short description of your itinerary",
    editPassword: "Shared editing password",
    editPasswordPlaceholder: "4–32 characters",
    editPasswordHint:
      "People who know this password can edit the plan with you.",
    startDate: "Start date",
    endDate: "End date",
    dateStatus: "Travel dates",
    dateFixed: "Dates confirmed",
    dateFlexible: "Dates undecided",
    tripDays: "Trip length",
    savedCourses: "Saved itineraries",
    courseSortLabel: "Sort itineraries",
    sortByTravelDate: "Date",
    sortByTitle: "Name",
    noDescription: "No description provided.",
    visitMemoPlaceholder: "Leave a memory or useful tip",
    chooseRating: "Select",
    visitHistory: "Visit history",
  },
};

const nameOf = (favorite, lang) =>
  favorite?.place?.location?.name?.[lang] ||
  favorite?.place?.location?.name?.ko ||
  "";
const placeNameOf = (place, lang) =>
  place?.location?.name?.[lang] || place?.location?.name?.ko || "";
const regionOf = (favorite, lang, fallback) =>
  favorite?.place?.location?.region?.[lang] ||
  favorite?.place?.location?.region?.ko ||
  fallback;
const keyOf = (item) => `${item.placeType}:${item.placeId}`;
const tripDurationLabel = (value) => {
  const days = Math.max(1, Number(value) || 1);
  return `${days} ${days === 1 ? "DAY" : "DAYS"}`;
};
const inclusiveDayCount = (start, end) => {
  if (!start || !end) return 1;
  const difference = Math.round(
    (Date.parse(`${end}T00:00:00`) - Date.parse(`${start}T00:00:00`)) /
      86400000,
  );
  return Math.max(1, difference + 1);
};
const itineraryDateRange = (start, end) => {
  if (!start) return [];
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end || start}T00:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first)
    return [];
  return Array.from(
    { length: Math.min(31, Math.floor((last - first) / 86400000) + 1) },
    (_, index) => new Date(first + index * 86400000).toISOString().slice(0, 10),
  );
};
const FAVORITE_REGION_ORDER = [
  "SEOUL",
  "GGICN",
  "GANGWON",
  "CCDAEJEON",
  "GSBUSANDAEGUULSAN",
  "JRGWANGJU",
  "JEJU",
  "OTHER",
];
const FAVORITE_REGION_LABELS = {
  SEOUL: { ko: "서울", en: "Seoul" },
  GGICN: { ko: "경기도/인천", en: "Gyeonggi/Incheon" },
  GANGWON: { ko: "강원도", en: "Gangwon" },
  CCDAEJEON: { ko: "충청도", en: "Chungcheong" },
  GSBUSANDAEGUULSAN: { ko: "경상도", en: "Gyeongsang" },
  JRGWANGJU: { ko: "전라도", en: "Jeolla" },
  JEJU: { ko: "제주도", en: "Jeju Island" },
};
const FAVORITE_CATEGORY_ORDER = FAVORITE_REGION_ORDER.filter(
  (code) => code !== "OTHER",
);

const copyShareUrl = async (url) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
};

function FavoriteCard({ favorite, lang, labels, onRemove }) {
  const name = nameOf(favorite, lang);
  const [isShareComplete, setIsShareComplete] = useState(false);

  const shareFavorite = async () => {
    const url = `${window.location.origin}${placePath(favorite.placeType, favorite.placeId, favorite.place?.source)}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: name, text: name, url });
      } else if (!(await copyShareUrl(url))) {
        window.prompt(labels.share, url);
        return;
      }
      setIsShareComplete(true);
      window.setTimeout(() => setIsShareComplete(false), 1500);
    } catch (error) {
      if (error?.name === "AbortError") return;
      if (await copyShareUrl(url)) {
        setIsShareComplete(true);
        window.setTimeout(() => setIsShareComplete(false), 1500);
      } else {
        window.prompt(labels.share, url);
      }
    }
  };
  return (
    <article className="placeCard">
      <div className="placeCardImage">
        <img src={placeImageUrl(favorite.place)} alt={name} />
        <span className="placeCardRegion">
          {regionOf(favorite, lang, labels.unknownRegion)}
        </span>
        <button
          type="button"
          className="placeCardFavoriteRemove"
          onClick={() => onRemove(favorite)}
          aria-label={`${name} ${labels.remove}`}
          title={labels.remove}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </button>
      </div>
      <div className="placeCardBody">
        <h3 className="lineClamp1">{name}</h3>
        <div className="placeCardActions">
          <Link
            to={placePath(
              favorite.placeType,
              favorite.placeId,
              favorite.place?.source,
            )}
          >
            {labels.open}
          </Link>
          <button
            type="button"
            onClick={shareFavorite}
            aria-label={`${name} ${labels.share}`}
            title={labels.share}
          >
            {isShareComplete ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4 4L19 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function MemberTabIcon({ type }) {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "favorites") {
    return (
      <svg {...commonProps}>
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      </svg>
    );
  }

  if (type === "courses") {
    return (
      <svg {...commonProps}>
        <path d="m10.586 5.414-5.172 5.172" />
        <path d="m18.586 13.414-5.172 5.172" />
        <path d="M6 12h12" />
        <circle cx="12" cy="20" r="2" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="20" cy="12" r="2" />
        <circle cx="4" cy="12" r="2" />
      </svg>
    );
  }

  if (type === "joinedCourses") {
    return (
      <svg {...commonProps}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="m3 17 2 2 4-4" />
      <rect x="3" y="4" width="6" height="6" rx="1" />
    </svg>
  );
}

function FavoriteMap({ favorites, lang, labels }) {
  useKakaoLoader();
  const markers = favorites.flatMap((favorite) => {
    const latLng = favorite.place?.location?.latLng;
    if (!latLng) return [];
    const [lat, lng] = latLng.split(",").map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng)
      ? [{ favorite, lat, lng }]
      : [];
  });
  if (!markers.length)
    return <div className="memberEmpty mapEmpty">{labels.noMap}</div>;
  const center = {
    lat: markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length,
    lng: markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length,
  };
  return (
    <KakaoMap
      className="favoriteMap"
      center={center}
      level={markers.length > 1 ? 12 : 4}
    >
      {markers.map(({ favorite, lat, lng }) => (
        <Fragment key={keyOf(favorite)}>
          <MapMarker position={{ lat, lng }} />
          <CustomOverlayMap position={{ lat, lng }} yAnchor={2.5}>
            <Link
              className="favoriteMapLabel"
              to={placePath(
                favorite.placeType,
                favorite.placeId,
                favorite.place?.source,
              )}
            >
              {nameOf(favorite, lang)}
            </Link>
          </CustomOverlayMap>
        </Fragment>
      ))}
    </KakaoMap>
  );
}

const MemberPage = ({ shared = false }) => {
  const { lang } = useLanguage();
  const labels = copy[lang === "ko" ? "ko" : "en"];
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("favorites");
  const [favorites, setFavorites] = useState([]);
  const [favoriteView, setFavoriteView] = useState("default");
  const [selectedFavoriteRegion, setSelectedFavoriteRegion] = useState("SEOUL");
  const [isFavoriteViewOpen, setIsFavoriteViewOpen] = useState(false);
  const favoriteViewRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [courseSort, setCourseSort] = useState("travelDate");
  const [visits, setVisits] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [coursePlaceRegion, setCoursePlaceRegion] = useState("ALL");
  const [visitForm, setVisitForm] = useState(emptyVisit);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [visitSearch, setVisitSearch] = useState("");
  const [isVisitSearchOpen, setIsVisitSearchOpen] = useState(false);
  const visitSearchRef = useRef(null);
  const [visitPlaces, setVisitPlaces] = useState([]);
  const [visitPlacesLoading, setVisitPlacesLoading] = useState(false);
  const [copied, setCopied] = useState("");

  // Device Size
  const { isFullMobile, isTablet } = useResponsive();

  // 페이지네이션
  // const ITEMS_PER_PAGE = 8;
  const ITEMS_PER_PAGE = isFullMobile ? 5 : isTablet ? 6 : 8;

  const filteredFavorites = useMemo(() => {
    if (favoriteView !== "region") return favorites;
    return favorites.filter(
      (favorite) =>
        favorite?.place?.location?.region?.code === selectedFavoriteRegion,
    );
  }, [favoriteView, favorites, selectedFavoriteRegion]);
  const favoritePagination = usePagination(
    filteredFavorites,
    ITEMS_PER_PAGE,
    `${tab}:${favoriteView}:${selectedFavoriteRegion}`,
  );
  const sortedCourses = useMemo(() => {
    const startTimeOf = (course) => {
      const timestamps = (course.days || [])
        .map((day) => Date.parse(day.date || ""))
        .filter((timestamp) => !Number.isNaN(timestamp));
      return timestamps.length
        ? Math.min(...timestamps)
        : Number.POSITIVE_INFINITY;
    };
    const titleGroupOf = (title = "") => {
      const firstCharacter = title.trim().charAt(0);
      if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(firstCharacter)) return 0;
      if (/[A-Za-z]/.test(firstCharacter)) return 1;
      return 2;
    };
    const compareTitles = (a, b) => {
      const aTitle = a.title?.trim() || "";
      const bTitle = b.title?.trim() || "";
      const aGroup = titleGroupOf(aTitle);
      const bGroup = titleGroupOf(bTitle);

      if (aGroup !== bGroup) return aGroup - bGroup;
      if (aGroup === 0) return aTitle.localeCompare(bTitle, "ko");
      if (aGroup === 1) {
        return aTitle.localeCompare(bTitle, "en", { sensitivity: "base" });
      }
      return aTitle.localeCompare(bTitle, lang === "ko" ? "ko" : "en", {
        numeric: true,
        sensitivity: "base",
      });
    };

    return [...courses].sort((a, b) => {
      if (courseSort === "title") {
        return compareTitles(a, b);
      }

      const dateDifference = startTimeOf(a) - startTimeOf(b);
      return dateDifference || compareTitles(a, b);
    });
  }, [courseSort, courses, lang]);
  const coursePagination = usePagination(
    sortedCourses,
    ITEMS_PER_PAGE,
    `${tab}:${courseSort}`,
  );
  const joinedCoursePagination = usePagination(
    joinedCourses,
    ITEMS_PER_PAGE,
    tab,
  );
  const visitPagination = usePagination(visits, ITEMS_PER_PAGE, tab);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const auth = await memberApi("/auth/session");
      setSession(auth);
      if (shared && id) {
        const course = await memberApi(`/itineraries/${id}`);
        setCourses([course]);
        setTab("courses");
      } else if (auth.authenticated) {
        const [favoriteData, courseData, joinedCourseData, visitData] =
          await Promise.all([
            memberApi("/favorites"),
            memberApi("/itineraries/mine"),
            memberApi("/itineraries/joined"),
            memberApi("/visits"),
          ]);
        setFavorites(favoriteData);
        setCourses(courseData);
        setJoinedCourses(joinedCourseData);
        setVisits(visitData);
      }
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setSession({ authenticated: false });
      } else setError(labels.loadError);
    } finally {
      setLoading(false);
    }
  }, [id, labels.loadError, shared]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isFavoriteViewOpen) return;
    const closeFavoriteView = (event) => {
      if (
        event.type === "mousedown" &&
        favoriteViewRef.current?.contains(event.target)
      )
        return;
      if (event.type === "keydown" && event.key !== "Escape") return;
      setIsFavoriteViewOpen(false);
    };
    document.addEventListener("mousedown", closeFavoriteView);
    document.addEventListener("keydown", closeFavoriteView);
    return () => {
      document.removeEventListener("mousedown", closeFavoriteView);
      document.removeEventListener("keydown", closeFavoriteView);
    };
  }, [isFavoriteViewOpen]);

  useEffect(() => {
    if (!isVisitSearchOpen) return;
    const closeVisitSearch = (event) => {
      if (
        event.type === "mousedown" &&
        visitSearchRef.current?.contains(event.target)
      )
        return;
      if (event.type === "keydown" && event.key !== "Escape") return;
      setIsVisitSearchOpen(false);
    };
    document.addEventListener("mousedown", closeVisitSearch);
    document.addEventListener("keydown", closeVisitSearch);
    return () => {
      document.removeEventListener("mousedown", closeVisitSearch);
      document.removeEventListener("keydown", closeVisitSearch);
    };
  }, [isVisitSearchOpen]);

  useEffect(() => {
    if (!session?.authenticated || tab !== "visits" || shared) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setVisitPlacesLoading(true);
      try {
        const places = await memberApi(
          `/places/search?q=${encodeURIComponent(visitSearch)}`,
        );
        if (active) setVisitPlaces(places);
      } catch {
        if (active) setVisitPlaces([]);
      } finally {
        if (active) setVisitPlacesLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [session?.authenticated, shared, tab, visitSearch]);

  const favoriteCategoryOptions = useMemo(
    () =>
      FAVORITE_CATEGORY_ORDER.map((code) => ({
        code,
        label: FAVORITE_REGION_LABELS[code][lang === "ko" ? "ko" : "en"],
      })),
    [lang],
  );
  const coursePlaceFavorites = useMemo(() => {
    if (coursePlaceRegion === "ALL") return favorites;
    return favorites.filter(
      (favorite) =>
        favorite?.place?.location?.region?.code === coursePlaceRegion,
    );
  }, [coursePlaceRegion, favorites]);
  const coursePlacePagination = usePagination(
    coursePlaceFavorites,
    7,
    coursePlaceRegion,
  );
  const coursePlacePageNumbers = useMemo(() => {
    const visiblePageCount = 5;
    const startPage = Math.max(
      1,
      Math.min(
        coursePlacePagination.currentPage - Math.floor(visiblePageCount / 2),
        coursePlacePagination.totalPages - visiblePageCount + 1,
      ),
    );
    const endPage = Math.min(
      coursePlacePagination.totalPages,
      startPage + visiblePageCount - 1,
    );

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [coursePlacePagination.currentPage, coursePlacePagination.totalPages]);

  const removeFavorite = async (favorite) => {
    await memberApi(`/favorites/${favorite.placeType}/${favorite.placeId}`, {
      method: "DELETE",
    });
    setFavorites((items) =>
      items.filter((item) => keyOf(item) !== keyOf(favorite)),
    );
  };

  const submitCourse = async (event) => {
    event.preventDefault();
    setError("");
    const originalCourse = editingCourse
      ? courses.find((course) => course._id === editingCourse)
      : null;
    const previousDates = itineraryDateRange(
      originalCourse?.days?.find((day) => day.date)?.date?.slice(0, 10),
      [...(originalCourse?.days || [])]
        .reverse()
        .find((day) => day.date)
        ?.date?.slice(0, 10),
    );
    const nextDates = itineraryDateRange(
      courseForm.date,
      courseForm.endDate || courseForm.date,
    );
    const nextDurationDays =
      courseForm.dateMode === "flexible"
        ? Number(courseForm.durationDays)
        : inclusiveDayCount(courseForm.date, courseForm.endDate || courseForm.date);
    const convertedSchedule = originalCourse
      ? (originalCourse.schedule || [])
          .map((day) => {
            const dayNumber =
              (originalCourse.dateMode || "fixed") === "flexible"
                ? Number(day.dayNumber) || 1
                : Math.max(
                    1,
                    previousDates.indexOf(String(day.date || "").slice(0, 10)) + 1,
                  );
            if (courseForm.dateMode === "flexible") {
              return dayNumber <= nextDurationDays
                ? { ...day, date: null, dayNumber }
                : null;
            }
            return nextDates[dayNumber - 1]
              ? { ...day, date: nextDates[dayNumber - 1], dayNumber: null }
              : null;
          })
          .filter(Boolean)
      : undefined;
    const body = {
      title: courseForm.title,
      description: courseForm.description,
      visibility: courseForm.visibility,
      dateMode: courseForm.dateMode,
      durationDays: nextDurationDays,
      ...(convertedSchedule ? { schedule: convertedSchedule } : {}),
      ...(!editingCourse && courseForm.editPassword
        ? { editPassword: courseForm.editPassword }
        : {}),
      days: [
        {
          date: courseForm.dateMode === "fixed" ? courseForm.date || null : null,
          dayNumber: courseForm.dateMode === "flexible" ? 1 : null,
          title: "",
          places: courseForm.selected.map((key, order) => {
            const [placeType, placeId] = key.split(":");
            return { placeType, placeId: Number(placeId), order, memo: "" };
          }),
        },
        ...(courseForm.dateMode === "fixed" && courseForm.endDate
          ? [{ date: courseForm.endDate, title: "", places: [] }]
          : []),
      ],
    };
    try {
      if (editingCourse)
        await memberApi(`/itineraries/${editingCourse}`, {
          method: "PATCH",
          body,
        });
      else await memberApi("/itineraries", { method: "POST", body });
      if (editingCourse && courseForm.editPassword) {
        await memberApi(`/itineraries/${editingCourse}/edit-password`, {
          method: "PUT",
          body: { password: courseForm.editPassword },
        });
      }
      setCourseForm(emptyCourse);
      setCoursePlaceRegion("ALL");
      setEditingCourse(null);
      await load();
      setTab("courses");
    } catch {
      setError(labels.saveError);
    }
  };

  const editCourse = (course) => {
    const day = course.days?.[0];
    setCourseForm({
      title: course.title,
      description: course.description || "",
      visibility: course.visibility,
      dateMode: course.dateMode || "fixed",
      durationDays: Math.min(31, Math.max(1, Number(course.durationDays) || 1)),
      date: day?.date ? day.date.slice(0, 10) : "",
      endDate: course.days?.[1]?.date ? course.days[1].date.slice(0, 10) : "",
      editPassword: "",
      selected: (course.days || [])
        .flatMap((courseDay) => courseDay.places || [])
        .map(keyOf),
    });
    setEditingCourse(course._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCourse = async (courseId) => {
    await memberApi(`/itineraries/${courseId}`, { method: "DELETE" });
    setCourses((items) => items.filter((item) => item._id !== courseId));
  };

  const submitVisit = async (event) => {
    event.preventDefault();
    setError("");
    const [placeType, placeId] = visitForm.placeKey.split(":");
    const body = {
      placeType,
      placeId: Number(placeId),
      visitedAt: visitForm.visitedAt,
      rating: visitForm.rating || null,
      memo: visitForm.memo,
    };
    try {
      if (editingVisit)
        await memberApi(`/visits/${editingVisit}`, { method: "PATCH", body });
      else await memberApi("/visits", { method: "POST", body });
      setVisitForm(emptyVisit);
      setVisitSearch("");
      setEditingVisit(null);
      await load();
      setTab("visits");
    } catch {
      setError(labels.saveError);
    }
  };

  const editVisit = (visit) => {
    setVisitForm({
      placeKey: keyOf(visit),
      visitedAt: visit.visitedAt.slice(0, 10),
      rating: visit.rating || "",
      memo: visit.memo || "",
    });
    setVisitSearch(nameOf(visit, lang));
    setEditingVisit(visit._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shareCourse = async (courseId) => {
    const url = `${window.location.origin}/itineraries/${courseId}`;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: labels.courses,
          text: labels.courses,
          url,
        });
      } else if (!(await copyShareUrl(url))) {
        window.prompt(labels.share, url);
        return;
      }

      setCopied(courseId);
      window.setTimeout(() => setCopied(""), 1500);
    } catch (error) {
      if (error?.name === "AbortError") return;

      if (await copyShareUrl(url)) {
        setCopied(courseId);
        window.setTimeout(() => setCopied(""), 1500);
      } else {
        window.prompt(labels.share, url);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="memberPage">
        <section className="memberPageCover contentWidth">
          <div className="memberHero">
            <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {labels.eyebrow}
            </p>
            <h2 className="title28px40px700">{labels.title}</h2>
            <p className="memberHeroSubtitle">{labels.subtitle}</p>
          </div>
          {loading ? (
            <div className="memberState">Loading...</div>
          ) : error && !session ? (
            <div className="memberState error">{error}</div>
          ) : !shared && !session?.authenticated ? (
            <div className="memberState">
              <h2>{labels.login}</h2>
              <p>{labels.loginHint}</p>
            </div>
          ) : (
            <div className="memberLayout">
              {!shared && (
                <nav className="memberTabs">
                  {[
                    ["favorites", labels.favorites],
                    ["courses", labels.courses],
                    ["joinedCourses", labels.joinedCourses],
                    ["visits", labels.visits],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={tab === value ? "active" : ""}
                      onClick={() => setTab(value)}
                    >
                      <MemberTabIcon type={value} />
                      {label}
                    </button>
                  ))}
                </nav>
              )}
              {error && (
                <p className="memberError" role="alert">
                  {error}
                </p>
              )}

              {tab === "favorites" && (
                <section className="memberSection">
                  <div className="memberSectionFavoritesMap">
                    <div className="memberSectionFavoritesMapTitle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-map-icon lucide-map"
                      >
                        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
                        <path d="M15 5.764v15" />
                        <path d="M9 3.236v15" />
                      </svg>
                      <p className="memberSectionMainTitle">
                        {labels.favorites}
                      </p>
                      <span>{favorites.length}</span>
                    </div>
                    <FavoriteMap
                      favorites={favorites}
                      lang={lang}
                      labels={labels}
                    />
                  </div>
                  {!favorites.length ? (
                    <div className="memberEmpty">{labels.emptyFavorite}</div>
                  ) : (
                    <div className="favoriteCollection">
                      <div
                        className="favoriteViewControl"
                        ref={favoriteViewRef}
                      >
                        <button
                          type="button"
                          className="favoriteViewTrigger"
                          aria-haspopup="listbox"
                          aria-expanded={isFavoriteViewOpen}
                          onClick={() =>
                            setIsFavoriteViewOpen((isOpen) => !isOpen)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-list-sort-descending-icon lucide-list-sort-descending"
                          >
                            <path d="M15 12H3" />
                            <path d="M3 5h18" />
                            <path d="M9 19H3" />
                          </svg>
                          <span>
                            {favoriteView === "region"
                              ? labels.groupByRegion
                              : labels.defaultView}
                          </span>
                          <svg
                            className={isFavoriteViewOpen ? "open" : ""}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="m6 9 6 6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <div
                          className={`favoriteViewMenu ${isFavoriteViewOpen ? "open" : ""}`}
                          role="listbox"
                          aria-label={labels.favoriteView}
                        >
                          {[
                            ["default", labels.defaultView],
                            ["region", labels.groupByRegion],
                          ].map(([value, label]) => (
                            <button
                              type="button"
                              role="option"
                              aria-selected={favoriteView === value}
                              className={
                                favoriteView === value ? "selected" : ""
                              }
                              key={value}
                              onClick={() => {
                                setFavoriteView(value);
                                setIsFavoriteViewOpen(false);
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {favoriteView === "region" && (
                        <div className="favoriteRegionCategories">
                          <ListCategory
                            options={favoriteCategoryOptions}
                            selected={selectedFavoriteRegion}
                            setSelected={setSelectedFavoriteRegion}
                            isFullMobile={isFullMobile}
                          />
                        </div>
                      )}
                      {filteredFavorites.length ? (
                        <div className="placeGrid">
                          {favoritePagination.pagedList.map((favorite) => (
                            <FavoriteCard
                              key={favorite._id}
                              favorite={favorite}
                              lang={lang}
                              labels={labels}
                              onRemove={removeFavorite}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="memberEmpty">{labels.emptyRegion}</div>
                      )}
                      <Pagination
                        currentPage={favoritePagination.currentPage}
                        totalPages={favoritePagination.totalPages}
                        onPageChange={favoritePagination.handlePageChange}
                      />
                    </div>
                  )}
                </section>
              )}

              {tab === "courses" && (
                <section className="memberSection courseSection">
                  {!shared && (
                    <form
                      className="memberForm courseFormCard"
                      onSubmit={submitCourse}
                    >
                      <div className="courseFormHeader">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-calendar-plus-icon lucide-calendar-plus"
                        >
                          <path d="M16 18h6" />
                          <path d="M16 2v3" />
                          <path d="M19 15v6" />
                          <path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" />
                          <path d="M3 9h18" />
                          <path d="M8 2v3" />
                        </svg>
                        <h2>
                          {editingCourse
                            ? labels.updateCourse
                            : labels.createCourse}
                        </h2>
                      </div>
                      <div className="courseFormBody">
                        <label>
                          {labels.titleLabel}
                          <input
                            required
                            maxLength="100"
                            placeholder={labels.courseNamePlaceholder}
                            value={courseForm.title}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                title: e.target.value,
                              })
                            }
                          />
                        </label>
                        <fieldset className="courseVisibilityPicker">
                          <legend>{labels.visibility}</legend>
                          {[
                            {
                              value: "public",
                              title: labels.publicVisibilityTitle,
                              description: labels.publicVisibilityDescription,
                              icon: "globe",
                            },
                            {
                              value: "unlisted",
                              title: labels.unlistedVisibilityTitle,
                              description: labels.unlistedVisibilityDescription,
                              icon: "link",
                            },
                            {
                              value: "private",
                              title: labels.privateVisibilityTitle,
                              description: labels.privateVisibilityDescription,
                              icon: "lock",
                            },
                          ].map((option) => (
                            <label
                              className={`courseVisibilityOption ${courseForm.visibility === option.value ? "selected" : ""}`}
                              key={option.value}
                            >
                              <input
                                type="radio"
                                name="courseVisibility"
                                value={option.value}
                                checked={courseForm.visibility === option.value}
                                onChange={(event) =>
                                  setCourseForm({
                                    ...courseForm,
                                    visibility: event.target.value,
                                  })
                                }
                              />
                              <span className="courseVisibilityCopy">
                                <strong>{option.title}</strong>
                                <small>{option.description}</small>
                              </span>
                              {option.icon === "globe" && (
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <circle cx="12" cy="12" r="9" />
                                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                                </svg>
                              )}
                              {option.icon === "link" && (
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
                                </svg>
                              )}
                              {option.icon === "lock" && (
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <rect
                                    x="5"
                                    y="10"
                                    width="14"
                                    height="11"
                                    rx="2"
                                  />
                                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                              )}
                            </label>
                          ))}
                        </fieldset>
                        <label>
                          {labels.description}
                          <textarea
                            maxLength="200"
                            placeholder={labels.descriptionPlaceholder}
                            value={courseForm.description}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                description: e.target.value,
                              })
                            }
                          />
                          <small className="courseCharCount">
                            {courseForm.description.length}/200
                          </small>
                        </label>
                        <fieldset className="courseDateStatusPicker">
                          <legend>{labels.dateStatus}</legend>
                          <div className="courseDateStatusOptions">
                            {[
                              { value: "fixed", label: labels.dateFixed },
                              { value: "flexible", label: labels.dateFlexible },
                            ].map((option) => (
                              <label
                                key={option.value}
                                className={
                                  courseForm.dateMode === option.value
                                    ? "selected"
                                    : ""
                                }
                              >
                                <input
                                  type="radio"
                                  name="courseDateMode"
                                  value={option.value}
                                  checked={courseForm.dateMode === option.value}
                                  onChange={(event) =>
                                    setCourseForm({
                                      ...courseForm,
                                      dateMode: event.target.value,
                                    })
                                  }
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        {courseForm.dateMode === "fixed" ? (
                          <div className="formRow courseDateRow">
                            <label>
                              {labels.startDate}
                              <input
                                type="date"
                                value={courseForm.date}
                                onChange={(e) =>
                                  setCourseForm({
                                    ...courseForm,
                                    date: e.target.value,
                                    endDate:
                                      courseForm.endDate &&
                                      courseForm.endDate < e.target.value
                                        ? e.target.value
                                        : courseForm.endDate,
                                  })
                                }
                              />
                            </label>
                            <label>
                              {labels.endDate}
                              <input
                                type="date"
                                min={courseForm.date || undefined}
                                value={courseForm.endDate}
                                onChange={(e) =>
                                  setCourseForm({
                                    ...courseForm,
                                    endDate: e.target.value,
                                  })
                                }
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="courseDurationField">
                            {labels.tripDays}
                            <select
                              value={courseForm.durationDays}
                              onChange={(event) =>
                                setCourseForm({
                                  ...courseForm,
                                  durationDays: Number(event.target.value),
                                })
                              }
                            >
                              {Array.from({ length: 31 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {tripDurationLabel(index + 1)}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                        <label>
                          {labels.editPassword}
                          <input
                            type="password"
                            minLength="4"
                            maxLength="32"
                            autoComplete="new-password"
                            placeholder={labels.editPasswordPlaceholder}
                            value={courseForm.editPassword}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                editPassword: e.target.value,
                              })
                            }
                          />
                          <small className="courseCharCount">
                            {labels.editPasswordHint}
                          </small>
                        </label>
                        <fieldset className="coursePlacePicker">
                          <legend>{labels.places}</legend>
                          <select
                            className="coursePlaceRegionSelect"
                            value={coursePlaceRegion}
                            onChange={(event) =>
                              setCoursePlaceRegion(event.target.value)
                            }
                            aria-label={labels.selectRegion}
                          >
                            <option value="ALL">{labels.allRegions}</option>
                            {favoriteCategoryOptions.map((region) => (
                              <option value={region.code} key={region.code}>
                                {region.label}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="coursePlaceRegionChevron"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                          {coursePlaceFavorites.length ? (
                            coursePlacePagination.pagedList.map((favorite) => (
                              <label className="checkPlace" key={favorite._id}>
                                <span className="coursePlaceIdentity">
                                  <input
                                    type="checkbox"
                                    checked={courseForm.selected.includes(
                                      keyOf(favorite),
                                    )}
                                    onChange={(e) =>
                                      setCourseForm({
                                        ...courseForm,
                                        selected: e.target.checked
                                          ? [
                                              ...courseForm.selected,
                                              keyOf(favorite),
                                            ]
                                          : courseForm.selected.filter(
                                              (key) => key !== keyOf(favorite),
                                            ),
                                      })
                                    }
                                  />
                                  <span>{nameOf(favorite, lang)}</span>
                                </span>
                                <em>
                                  {regionOf(
                                    favorite,
                                    lang,
                                    labels.unknownRegion,
                                  )}
                                </em>
                              </label>
                            ))
                          ) : (
                            <p className="coursePlaceEmpty">
                              {coursePlaceRegion === "ALL"
                                ? labels.emptyFavorite
                                : labels.emptyCourseRegion}
                            </p>
                          )}
                          {coursePlacePagination.totalPages > 1 && (
                            <nav
                              className="coursePlacePagination"
                              aria-label={
                                lang === "ko"
                                  ? "찜 장소 페이지"
                                  : "Saved places pages"
                              }
                            >
                              <button
                                type="button"
                                className="coursePlacePageArrow"
                                onClick={() =>
                                  coursePlacePagination.handlePageChange(
                                    coursePlacePagination.currentPage - 1,
                                  )
                                }
                                disabled={
                                  coursePlacePagination.currentPage === 1
                                }
                                aria-label={
                                  lang === "ko"
                                    ? "이전 페이지"
                                    : "Previous page"
                                }
                              >
                                ‹
                              </button>
                              {coursePlacePageNumbers.map((page) => (
                                <button
                                  type="button"
                                  key={page}
                                  className={`coursePlacePageNumber ${coursePlacePagination.currentPage === page ? "active" : ""}`}
                                  onClick={() =>
                                    coursePlacePagination.handlePageChange(page)
                                  }
                                  aria-current={
                                    coursePlacePagination.currentPage === page
                                      ? "page"
                                      : undefined
                                  }
                                >
                                  {page}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="coursePlacePageArrow"
                                onClick={() =>
                                  coursePlacePagination.handlePageChange(
                                    coursePlacePagination.currentPage + 1,
                                  )
                                }
                                disabled={
                                  coursePlacePagination.currentPage ===
                                  coursePlacePagination.totalPages
                                }
                                aria-label={
                                  lang === "ko" ? "다음 페이지" : "Next page"
                                }
                              >
                                ›
                              </button>
                            </nav>
                          )}
                        </fieldset>
                        <div className="formActions courseFormActions">
                          <button className="primary" type="submit">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 21v-7h8v7" />
                            </svg>
                            {editingCourse
                              ? labels.updateCourse
                              : labels.createCourse}
                          </button>
                          {editingCourse && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourse(null);
                                setCourseForm(emptyCourse);
                              }}
                            >
                              {labels.cancel}
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="savedCourseHeading courseListHeading">
                    <div className="savedCourseTitle">
                      <h2>{labels.savedCourses}</h2>
                      <span>{courses.length}</span>
                    </div>
                    {!shared && courses.length > 0 && (
                      <label className="courseSortControl">
                        <select
                          value={courseSort}
                          onChange={(event) =>
                            setCourseSort(event.target.value)
                          }
                          aria-label={labels.courseSortLabel}
                        >
                          <option value="travelDate">
                            {labels.sortByTravelDate}
                          </option>
                          <option value="title">{labels.sortByTitle}</option>
                        </select>
                        <svg
                          className="courseSortChevron"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </label>
                    )}
                  </div>
                  {!courses.length ? (
                    <div className="memberEmpty">{labels.emptyCourse}</div>
                  ) : (
                    <>
                      <div className="courseCardGrid">
                        {coursePagination.pagedList.map((course) => {
                          const allPlaces = (course.days || []).flatMap(
                            (day) => day.places || [],
                          );
                          const cover = allPlaces.find(
                            (place) => place.place?.img?.link,
                          );
                          const datedDays = (course.days || []).filter(
                            (day) => day.date,
                          );
                          return (
                            <article
                              key={course._id}
                              className="savedCourseCard"
                              role="link"
                              tabIndex={0}
                              onClick={(event) => {
                                if (!event.target.closest("button, a"))
                                  navigate(`/itineraries/${course._id}`);
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter")
                                  navigate(`/itineraries/${course._id}`);
                              }}
                            >
                              <div className="savedCourseImage">
                                {cover ? (
                                  <img
                                    src={placeImageUrl(cover.place)}
                                    alt=""
                                  />
                                ) : (
                                  <div className="courseImageFallback" />
                                )}
                                <span
                                  className={`visibility ${course.visibility}`}
                                >
                                  {labels[course.visibility]}
                                </span>
                                {!shared && course.isOwner !== false && (
                                  <button
                                    type="button"
                                    className="courseDelete"
                                    onClick={() => deleteCourse(course._id)}
                                    aria-label={labels.remove}
                                    title={labels.remove}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-trash2-icon lucide-trash-2"
                                    >
                                      <path d="M10 11v6" />
                                      <path d="M14 11v6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                      <path d="M3 6h18" />
                                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="savedCourseBody">
                                <div className="savedCourseTitleCover">
                                  <h3 className="lineClamp1">{course.title}</h3>
                                  <div className="courseTags">
                                    <span>
                                      {lang === "ko"
                                        ? `장소 ${allPlaces.length}개`
                                        : `${allPlaces.length} ${allPlaces.length === 1 ? "place" : "places"}`}
                                    </span>
                                  </div>
                                </div>
                                <p className="lineClamp2">
                                  {course.description || labels.noDescription}
                                </p>
                                {course.dateMode === "flexible" ? (
                                  <time>
                                    {tripDurationLabel(course.durationDays)}
                                  </time>
                                ) : datedDays.length > 0 ? (
                                  <time>
                                    {datedDays
                                      .map((day) =>
                                        new Date(day.date).toLocaleDateString(
                                          lang,
                                        ),
                                      )
                                      .join(" ~ ")}
                                  </time>
                                ) : null}
                                <div className="courseCardActions">
                                  {!shared && course.canEdit !== false && (
                                    <button
                                      type="button"
                                      onClick={() => editCourse(course)}
                                    >
                                      {labels.edit}
                                    </button>
                                  )}
                                  {course.visibility !== "private" && (
                                    <button
                                      type="button"
                                      className="courseShareButton"
                                      onClick={() => shareCourse(course._id)}
                                      aria-label={
                                        copied === course._id
                                          ? labels.copied
                                          : labels.share
                                      }
                                      title={labels.share}
                                    >
                                      {copied === course._id ? (
                                        <svg
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                        >
                                          <path d="m5 12 4 4L19 6" />
                                        </svg>
                                      ) : (
                                        <svg
                                          viewBox="0 0 24 24"
                                          aria-hidden="true"
                                        >
                                          <circle cx="18" cy="5" r="3" />
                                          <circle cx="6" cy="12" r="3" />
                                          <circle cx="18" cy="19" r="3" />
                                          <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
                                        </svg>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                      <Pagination
                        currentPage={coursePagination.currentPage}
                        totalPages={coursePagination.totalPages}
                        onPageChange={coursePagination.handlePageChange}
                      />
                    </>
                  )}
                </section>
              )}

              {tab === "joinedCourses" && (
                <section className="memberSection courseSection">
                  <div className="savedCourseHeading courseListHeading">
                    <div className="savedCourseTitle">
                      <h2>{labels.joinedCoursesTitle}</h2>
                      <span>{joinedCourses.length}</span>
                    </div>
                  </div>
                  {!joinedCourses.length ? (
                    <div className="memberEmpty">
                      {labels.emptyJoinedCourse}
                    </div>
                  ) : (
                    <>
                      <div className="courseCardGrid">
                        {joinedCoursePagination.pagedList.map((course) => {
                          const allPlaces = (course.days || []).flatMap(
                            (day) => day.places || [],
                          );
                          const cover = allPlaces.find(
                            (place) => place.place?.img?.link,
                          );
                          const datedDays = (course.days || []).filter(
                            (day) => day.date,
                          );
                          return (
                            <article
                              key={course._id}
                              className="savedCourseCard"
                              role="link"
                              tabIndex={0}
                              onClick={() =>
                                navigate(`/itineraries/${course._id}`)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter")
                                  navigate(`/itineraries/${course._id}`);
                              }}
                            >
                              <div className="savedCourseImage">
                                {cover ? (
                                  <img
                                    src={placeImageUrl(cover.place)}
                                    alt=""
                                  />
                                ) : (
                                  <div className="courseImageFallback" />
                                )}
                                <div className="sharedCourseBadges">
                                  <span
                                    className={`visibility ${course.visibility}`}
                                  >
                                    {labels[course.visibility]}
                                  </span>
                                  <span
                                    className={`shareRole ${course.shareRole}`}
                                  >
                                    {labels[course.shareRole]}
                                  </span>
                                </div>
                              </div>
                              <div className="savedCourseBody">
                                <div className="savedCourseTitleCover">
                                  <h3>{course.title}</h3>
                                  <div className="courseTags">
                                    <span>
                                      {lang === "ko"
                                        ? `장소 ${allPlaces.length}개`
                                        : `${allPlaces.length} ${allPlaces.length === 1 ? "place" : "places"}`}
                                    </span>
                                  </div>
                                </div>
                                <p className="lineClamp2">
                                  {course.description || labels.noDescription}
                                </p>
                                {course.dateMode === "flexible" ? (
                                  <time>
                                    {tripDurationLabel(course.durationDays)}
                                  </time>
                                ) : datedDays.length > 0 ? (
                                  <time>
                                    {datedDays
                                      .map((day) =>
                                        new Date(day.date).toLocaleDateString(
                                          lang,
                                        ),
                                      )
                                      .join(" ~ ")}
                                  </time>
                                ) : null}
                                <div className="courseCardActions">
                                  <span>{labels.open}</span>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                      <Pagination
                        currentPage={joinedCoursePagination.currentPage}
                        totalPages={joinedCoursePagination.totalPages}
                        onPageChange={joinedCoursePagination.handlePageChange}
                      />
                    </>
                  )}
                </section>
              )}

              {tab === "visits" && (
                <section className="memberSection visitSection">
                  <form
                    className="memberForm visitFormCard"
                    onSubmit={submitVisit}
                  >
                    <div className="visitFormHeader">
                      <span>
                        <MemberTabIcon type="visits" />
                      </span>
                      <h2>
                        {editingVisit ? labels.updateVisit : labels.createVisit}
                      </h2>
                    </div>
                    <div className="visitFormBody">
                      <div
                        className={`visitPlacePicker ${isVisitSearchOpen ? "open" : ""}`}
                        ref={visitSearchRef}
                      >
                        <label>
                          {labels.place}
                          <span className="visitSearchInput">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="11" cy="11" r="7" />
                              <path d="m20 20-4-4" />
                            </svg>
                            <input
                              type="search"
                              autoComplete="off"
                              placeholder={labels.searchPlace}
                              value={visitSearch}
                              onFocus={() => setIsVisitSearchOpen(true)}
                              onChange={(e) => {
                                setVisitSearch(e.target.value);
                                setIsVisitSearchOpen(true);
                              }}
                            />
                          </span>
                        </label>
                        {isVisitSearchOpen && (
                          <div
                            className="visitPlaceResults"
                            role="listbox"
                            aria-label={labels.selectPlace}
                          >
                            {visitPlacesLoading ? (
                              <p>Loading...</p>
                            ) : visitPlaces.length ? (
                              visitPlaces.map((place) => (
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={
                                    visitForm.placeKey === keyOf(place)
                                  }
                                  className={
                                    visitForm.placeKey === keyOf(place)
                                      ? "selected"
                                      : ""
                                  }
                                  key={keyOf(place)}
                                  onClick={() => {
                                    setVisitForm({
                                      ...visitForm,
                                      placeKey: keyOf(place),
                                    });
                                    setVisitSearch(placeNameOf(place, lang));
                                    setIsVisitSearchOpen(false);
                                  }}
                                >
                                  <span>
                                    <strong>{placeNameOf(place, lang)}</strong>
                                    <small>
                                      {place.location?.region?.[lang] ||
                                        place.location?.region?.ko}
                                    </small>
                                  </span>
                                  <em>{place.placeType}</em>
                                </button>
                              ))
                            ) : (
                              <p>{labels.noPlaceResult}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="formRow visitMetaRow">
                        <label>
                          {labels.visitDate}
                          <input
                            required
                            type="date"
                            value={visitForm.visitedAt}
                            onChange={(e) =>
                              setVisitForm({
                                ...visitForm,
                                visitedAt: e.target.value,
                              })
                            }
                          />
                        </label>
                        <fieldset className="ratingPicker">
                          <legend>{labels.rating}</legend>
                          <div>
                            {[1, 2, 3, 4, 5].map((number) => (
                              <button
                                type="button"
                                key={number}
                                className={
                                  Number(visitForm.rating) >= number
                                    ? "selected"
                                    : ""
                                }
                                onClick={() =>
                                  setVisitForm({
                                    ...visitForm,
                                    rating: String(number),
                                  })
                                }
                                aria-label={`${number} / 5`}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" />
                                </svg>
                              </button>
                            ))}
                            <span>
                              {visitForm.rating || labels.chooseRating}
                            </span>
                          </div>
                        </fieldset>
                      </div>
                      <label className="visitMemo">
                        {labels.memo}
                        <textarea
                          maxLength="500"
                          placeholder={labels.visitMemoPlaceholder}
                          value={visitForm.memo}
                          onChange={(e) =>
                            setVisitForm({ ...visitForm, memo: e.target.value })
                          }
                        />
                        <small>{visitForm.memo.length}/500</small>
                      </label>
                      <div className="formActions visitFormActions">
                        <button
                          className="primary"
                          type="submit"
                          disabled={!visitForm.placeKey}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 21v-7h8v7" />
                          </svg>
                          {editingVisit
                            ? labels.updateVisit
                            : labels.createVisit}
                        </button>
                        {editingVisit && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVisit(null);
                              setVisitForm(emptyVisit);
                              setVisitSearch("");
                            }}
                          >
                            {labels.cancel}
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                  <div className="savedCourseHeading">
                    <h2>{labels.visitHistory}</h2>
                    <span>{visits.length}</span>
                  </div>
                  {!visits.length ? (
                    <div className="memberEmpty">{labels.emptyVisit}</div>
                  ) : (
                    <>
                      <div className="visitRecordList">
                        {visitPagination.pagedList.map((visit) => (
                          <article className="visitRecordCard" key={visit._id}>
                            <img src={placeImageUrl(visit.place)} alt="" />
                            <div className="visitRecordBody">
                              <h3>{nameOf(visit, lang)}</h3>
                              <div className="visitRecordMeta">
                                <span>
                                  ⌖{" "}
                                  {visit.place?.location?.region?.[lang] ||
                                    visit.place?.location?.region?.ko}
                                </span>
                                <time>
                                  ▣{" "}
                                  {new Date(visit.visitedAt).toLocaleDateString(
                                    lang,
                                  )}
                                </time>
                              </div>
                              {visit.rating && (
                                <div className="visitRecordRating">
                                  {"★".repeat(visit.rating)}
                                  <span>{"★".repeat(5 - visit.rating)}</span>
                                </div>
                              )}
                              <p>{visit.memo}</p>
                            </div>
                            <div className="visitRecordActions">
                              <button
                                type="button"
                                className="visitEdit"
                                onClick={() => editVisit(visit)}
                              >
                                {labels.edit}
                              </button>
                              <button
                                type="button"
                                className="visitDelete"
                                onClick={async () => {
                                  await memberApi(`/visits/${visit._id}`, {
                                    method: "DELETE",
                                  });
                                  setVisits((items) =>
                                    items.filter(
                                      (item) => item._id !== visit._id,
                                    ),
                                  );
                                }}
                                aria-label={labels.remove}
                                title={labels.remove}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash2-icon lucide-trash-2"
                                >
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                      <Pagination
                        currentPage={visitPagination.currentPage}
                        totalPages={visitPagination.totalPages}
                        onPageChange={visitPagination.handlePageChange}
                      />
                    </>
                  )}
                </section>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MemberPage;
