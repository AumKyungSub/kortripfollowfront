import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import {
  ApiError,
  memberApi,
  placeImageUrl,
  placePath,
} from "@/shared/api/memberApi";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { usePagination } from "@/shared/hooks/usePagination";
import "./CourseDetailPage.style.css";

const text = {
  ko: {
    back: "저장한 코스로",
    info: "코스 정보",
    schedule: "시간표",
    checklist: "체크리스트",
    editors: "함께 편집",
    registeredMembers: "등록된 멤버",
    description: "설명",
    period: "여행 기간",
    places: "코스에 담긴 장소",
    visitPlan: "방문 순서 계획",
    visitPlanHint: "방문할 장소를 선택하고 순서를 조정해 보세요.",
    addToVisitPlan: "방문 순서에 추가",
    noVisitPlan: "방문 순서에 추가된 장소가 없습니다.",
    visitOrderMap: "방문 순서",
    allPlacesMap: "담긴 지역",
    map: "코스 지도",
    edit: "수정",
    save: "저장",
    cancel: "취소",
    start: "여행 시작일",
    end: "여행 종료일",
    dateStatus: "여행 날짜",
    dateFixed: "날짜 확정",
    dateFlexible: "날짜 미확정",
    tripDays: "여행 일수",
    title: "코스 이름",
    visibility: "공개 범위",
    private: "비공개",
    unlisted: "링크 공개",
    public: "전체 공개",
    noDescription: "등록된 설명이 없습니다.",
    noPlaces: "코스에 담긴 장소가 없습니다.",
    noMap: "지도에 표시할 장소가 없습니다.",
    searchMode: "검색",
    favoritesMode: "내 찜",
    placeSearch: "장소명·지역·주소 검색",
    addPlace: "추가",
    addedPlace: "추가됨",
    removePlace: "빼기",
    moveUp: "올리기",
    moveDown: "내리기",
    noPlaceResult: "검색된 장소가 없습니다.",
    favoritesLoading: "찜한 장소를 불러오는 중입니다.",
    noFavorites: "아직 찜한 장소가 없습니다.",
    allRegions: "전체 지역",
    selectRegion: "지역 선택",
    emptyFavoriteRegion: "이 지역에는 찜한 장소가 없습니다.",
    previousPage: "이전 페이지",
    nextPage: "다음 페이지",
    favoritesPages: "찜 장소 페이지",
    scheduleHint: "날짜별 이동과 활동 시간을 계획해 보세요.",
    dateInputMode: "월일 입력",
    dayInputMode: "DAY 입력",
    addPlan: "일정 추가",
    date: "날짜",
    time: "시간",
    plan: "계획",
    place: "장소",
    memo: "메모 (선택)",
    emptySchedule: "아직 등록된 시간 계획이 없습니다.",
    checklistHint: "여행 전에 챙겨야 할 준비물을 함께 확인하세요.",
    checklistPlaceholder: "예: 여권, 충전기",
    add: "추가",
    emptyChecklist: "이 영역의 체크리스트가 비어 있습니다.",
    remove: "삭제",
    common: "공통",
    author: "작성자",
    registeredMember: "등록 멤버",
    personalChecklistHint:
      "개인 영역은 해당 멤버만 추가·체크·삭제할 수 있습니다.",
    editorHint:
      "함께 계획할 비밀번호를 설정하거나 변경하고 편집 권한이 있는 멤버를 관리할 수 있습니다.",
    passwordPlaceholder: "4~32자 비밀번호",
    setPassword: "비밀번호 저장",
    joinHint: "작성자가 공유한 비밀번호를 입력해 편집 권한을 등록하세요.",
    registeredHint: "편집 권한이 등록되어 있습니다.",
    join: "편집 참여",
    noEditors: "편집 권한이 등록된 멤버가 없습니다.",
    passwordUsage: "해당 비밀번호를 아는 사람들과 함께 계획 수정이 가능합니다.",
    wrongPassword: "비밀번호가 올바르지 않습니다.",
    joined: "편집 권한이 등록되었습니다.",
    revoke: "권한 해제",
    viewOnly:
      "이 코스는 보기만 가능합니다. 비밀번호를 인증한 회원만 수정할 수 있습니다.",
    loginRequired: "로그인 후 비밀번호를 인증하면 함께 수정할 수 있습니다.",
    loadError: "코스를 불러오지 못했습니다.",
    saveError: "저장하지 못했습니다.",
    notFound: "코스를 찾을 수 없거나 볼 권한이 없습니다.",
  },
  en: {
    back: "Back to itineraries",
    info: "Overview",
    schedule: "Schedule",
    checklist: "Checklist",
    editors: "Collaborators",
    registeredMembers: "Registered members",
    description: "Description",
    period: "Travel dates",
    places: "Places",
    visitPlan: "Visit order plan",
    visitPlanHint: "Choose places to visit and arrange their order.",
    addToVisitPlan: "Add to visit order",
    noVisitPlan: "No places have been added to the visit order.",
    visitOrderMap: "Visit order",
    allPlacesMap: "All places",
    map: "Course map",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    start: "Start date",
    end: "End date",
    dateStatus: "Travel dates",
    dateFixed: "Dates confirmed",
    dateFlexible: "Dates undecided",
    tripDays: "Trip length",
    title: "Title",
    visibility: "Visibility",
    private: "Private",
    unlisted: "Link only",
    public: "Public",
    noDescription: "No description provided.",
    noPlaces: "No places in this itinerary.",
    noMap: "No locations to show.",
    searchMode: "Search",
    favoritesMode: "Saved",
    placeSearch: "Search by place, region, or address",
    addPlace: "Add",
    addedPlace: "Added",
    removePlace: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    noPlaceResult: "No places found.",
    favoritesLoading: "Loading your saved places.",
    noFavorites: "No saved places yet.",
    allRegions: "All regions",
    selectRegion: "Select region",
    emptyFavoriteRegion: "There are no saved places in this region.",
    previousPage: "Previous page",
    nextPage: "Next page",
    favoritesPages: "Saved places pages",
    scheduleHint: "Plan activities for each day.",
    dateInputMode: "Date input",
    dayInputMode: "DAY input",
    addPlan: "Add plan",
    date: "Date",
    time: "Time",
    plan: "Plan",
    place: "Place",
    memo: "Memo (optional)",
    emptySchedule: "No schedule yet.",
    checklistHint: "Keep track of everything you need before your trip.",
    checklistPlaceholder: "e.g. passport, charger",
    add: "Add",
    emptyChecklist: "This checklist is empty.",
    remove: "Remove",
    common: "Shared",
    author: "Author",
    registeredMember: "Member",
    personalChecklistHint:
      "Only this member can add, check, or delete items in their personal area.",
    editorHint:
      "Set the shared password and manage members with editing access.",
    passwordPlaceholder: "4–32 characters",
    setPassword: "Save password",
    joinHint: "Enter the password shared by the owner to get editing access.",
    registeredHint: "Editing access is already registered.",
    join: "Join editing",
    noEditors: "No members have editing access yet.",
    passwordUsage: "People who know this password can edit the plan with you.",
    wrongPassword: "The password is incorrect.",
    joined: "Editing access granted.",
    revoke: "Revoke access",
    viewOnly:
      "This itinerary is view-only. Signed-in members who verify the password can edit.",
    loginRequired: "Sign in and verify the password to edit.",
    loadError: "Could not load the itinerary.",
    saveError: "Could not save changes.",
    notFound: "This itinerary is unavailable.",
  },
};

const dateValue = (value) => (value ? String(value).slice(0, 10) : "");
const dateRange = (start, end) => {
  if (!start) return [];
  const first = Date.parse(`${start}T00:00:00Z`);
  const last = Date.parse(`${end || start}T00:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first)
    return [];
  const result = [];
  const oneDay = 24 * 60 * 60 * 1000;
  for (let time = first; time <= last && result.length < 366; time += oneDay) {
    result.push(new Date(time).toISOString().slice(0, 10));
  }
  return result;
};
const placeName = (place, lang) =>
  place?.place?.location?.name?.[lang] ||
  place?.place?.location?.name?.ko ||
  place?.location?.name?.[lang] ||
  place?.location?.name?.ko ||
  "";
const placeRegion = (place, lang) =>
  place?.place?.location?.region?.[lang] ||
  place?.place?.location?.region?.ko ||
  place?.location?.region?.[lang] ||
  place?.location?.region?.ko ||
  "";
const placeKey = (place) => `${place.placeType}:${place.placeId}`;
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
  OTHER: { ko: "기타 지역", en: "Other regions" },
};
function SelectWithChevron({
  children,
  className = "",
  onBlur,
  onChange,
  onKeyDown,
  onPointerDown,
  ...props
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`courseSelectControl ${className}`.trim()}>
      <select
        {...props}
        onPointerDown={(event) => {
          setOpen(true);
          onPointerDown?.(event);
        }}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key))
            setOpen(true);
          if (event.key === "Escape") setOpen(false);
          onKeyDown?.(event);
        }}
        onBlur={(event) => {
          setOpen(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          setOpen(false);
          onChange?.(event);
        }}
      >
        {children}
      </select>
      <svg
        className={open ? "open" : ""}
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
    </div>
  );
}
function CourseMap({ allPlaces, visitPlan, lang, labels }) {
  useKakaoLoader();
  const [mode, setMode] = useState("visitPlan");
  const places = mode === "visitPlan" ? visitPlan : allPlaces;
  const markers = places.flatMap((place) => {
    const pair = place?.place?.location?.latLng?.split(",").map(Number);
    return pair?.length === 2 && pair.every(Number.isFinite)
      ? [{ place, lat: pair[0], lng: pair[1] }]
      : [];
  });
  const center = {
    lat: markers.length
      ? markers.reduce((sum, item) => sum + item.lat, 0) / markers.length
      : 37.5665,
    lng: markers.length
      ? markers.reduce((sum, item) => sum + item.lng, 0) / markers.length
      : 126.978,
  };
  return (
    <div className="courseMapWrap">
      <div className="courseMapModes">
        <button
          className={mode === "visitPlan" ? "active" : ""}
          onClick={() => setMode("visitPlan")}
        >
          {labels.visitOrderMap}
        </button>
        <button
          className={mode === "allPlaces" ? "active" : ""}
          onClick={() => setMode("allPlaces")}
        >
          {labels.allPlacesMap}
        </button>
      </div>
      {!markers.length ? (
        <div className="courseDetailEmpty courseDetailMap">{labels.noMap}</div>
      ) : (
        <Map
          className="courseDetailMap"
          center={center}
          level={markers.length > 1 ? 11 : 4}
        >
          {markers.map(({ place, lat, lng }, index) => (
            <Fragment key={`${place.placeType}:${place.placeId}`}>
              <MapMarker position={{ lat, lng }} />
              <CustomOverlayMap position={{ lat, lng }} yAnchor={2.3}>
                <span className="courseMapLabel">
                  {mode === "visitPlan" ? `${index + 1}. ` : ""}
                  {placeName(place, lang)}
                </span>
              </CustomOverlayMap>
            </Fragment>
          ))}
        </Map>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const labels = text[lang === "ko" ? "ko" : "en"];
  const [course, setCourse] = useState(null);
  const [session, setSession] = useState(null);
  const [active, setActive] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    title: "",
    description: "",
    visibility: "private",
    dateMode: "fixed",
    durationDays: 1,
    start: "",
    end: "",
  });
  const [planForm, setPlanForm] = useState({
    date: "",
    time: "",
    title: "",
    placeKey: "",
    memo: "",
  });
  const [scheduleDateMode, setScheduleDateMode] = useState("date");
  const [checkText, setCheckText] = useState("");
  const [checklistCategory, setChecklistCategory] = useState("common");
  const [editPassword, setEditPassword] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [draftDays, setDraftDays] = useState([]);
  const [placePickerMode, setPlacePickerMode] = useState("search");
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeResults, setPlaceResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoriteRegion, setFavoriteRegion] = useState("ALL");
  const [savingVisitPlan, setSavingVisitPlan] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [auth, data] = await Promise.all([
        memberApi("/auth/session"),
        memberApi(`/itineraries/${id}`),
      ]);
      setSession(auth);
      setCourse(data);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError && requestError.status === 404
          ? labels.notFound
          : labels.loadError,
      );
    } finally {
      setLoading(false);
    }
  }, [id, labels.loadError, labels.notFound]);
  useEffect(() => {
    load();
  }, [load]);

  const places = useMemo(
    () =>
      (course?.days || [])
        .flatMap((day) => day.places || [])
        .sort((a, b) => a.order - b.order),
    [course],
  );
  const dates = useMemo(
    () =>
      (course?.days || [])
        .map((day) => dateValue(day.date))
        .filter(Boolean)
        .sort(),
    [course],
  );
  const courseDateMode = course?.dateMode || "fixed";
  const durationDays = Math.min(
    31,
    Math.max(1, Number(course?.durationDays) || dateRange(dates[0], dates.at(-1)).length || 1),
  );
  const scheduleDayOptions = useMemo(
    () =>
      courseDateMode === "flexible"
        ? Array.from({ length: durationDays }, (_, index) => String(index + 1))
        : dateRange(dates[0], dates.at(-1)),
    [courseDateMode, dates, durationDays],
  );
  const changeScheduleDateMode = (mode) => {
    if (courseDateMode === "flexible" && mode === "date") return;
    setScheduleDateMode(mode);
    if (
      mode === "day" &&
      !scheduleDayOptions.includes(planForm.date)
    ) {
      setPlanForm({ ...planForm, date: scheduleDayOptions[0] || "" });
    }
  };
  useEffect(() => {
    if (courseDateMode === "flexible") {
      setScheduleDateMode("day");
      setPlanForm((previous) => ({
        ...previous,
        date: scheduleDayOptions.includes(previous.date)
          ? previous.date
          : scheduleDayOptions[0] || "",
      }));
    }
  }, [courseDateMode, scheduleDayOptions]);
  const cover = places.find((place) => place.place?.img?.link);
  const beginInfoEdit = () => {
    setInfoForm({
      title: course.title,
      description: course.description || "",
      visibility: course.visibility,
      dateMode: courseDateMode,
      durationDays,
      start: dates[0] || "",
      end: dates.at(-1) || "",
    });
    setDraftDays(structuredClone(course.days || []));
    setPlacePickerMode("search");
    setPlaceSearch("");
    setPlaceResults([]);
    setFavoriteRegion("ALL");
    setEditingInfo(true);
  };
  useEffect(() => {
    if (!editingInfo || !placeSearch.trim()) {
      setPlaceResults([]);
      return;
    }
    let activeRequest = true;
    const timer = window.setTimeout(async () => {
      try {
        const results = await memberApi(
          `/places/search?q=${encodeURIComponent(placeSearch.trim())}`,
        );
        if (activeRequest) setPlaceResults(results.slice(0, 8));
      } catch {
        if (activeRequest) setPlaceResults([]);
      }
    }, 250);
    return () => {
      activeRequest = false;
      window.clearTimeout(timer);
    };
  }, [editingInfo, placeSearch]);
  useEffect(() => {
    if (!editingInfo || placePickerMode !== "favorites" || favorites.length)
      return;
    let activeRequest = true;
    setFavoritesLoading(true);
    memberApi("/favorites")
      .then((results) => {
        if (activeRequest) setFavorites(results);
      })
      .catch(() => {
        if (activeRequest) setFavorites([]);
      })
      .finally(() => {
        if (activeRequest) setFavoritesLoading(false);
      });
    return () => {
      activeRequest = false;
    };
  }, [editingInfo, favorites.length, placePickerMode]);
  const filteredFavorites = useMemo(
    () =>
      favoriteRegion === "ALL"
        ? favorites
        : favorites.filter(
            (favorite) =>
              favorite?.place?.location?.region?.code === favoriteRegion,
          ),
    [favoriteRegion, favorites],
  );
  const favoritePagination = usePagination(
    filteredFavorites,
    7,
    favoriteRegion,
  );
  const draftPlaceKeys = useMemo(
    () =>
      new Set(
        draftDays
          .flatMap((day) => day.places || [])
          .map((place) => placeKey(place)),
      ),
    [draftDays],
  );
  const patchCourse = async (body) => {
    setError("");
    try {
      const updated = await memberApi(`/itineraries/${id}`, {
        method: "PATCH",
        body,
      });
      setCourse((previous) => ({
        ...previous,
        ...updated,
        isOwner: previous.isOwner,
        canEdit: previous.canEdit,
      }));
      return true;
    } catch {
      setError(labels.saveError);
      return false;
    }
  };
  const saveInfo = async (event) => {
    event.preventDefault();
    const nextDateMode = infoForm.dateMode;
    const nextDurationDays =
      nextDateMode === "flexible"
        ? Math.min(31, Math.max(1, Number(infoForm.durationDays) || 1))
        : Math.max(1, dateRange(infoForm.start, infoForm.end || infoForm.start).length);
    const draftPlaces = draftDays.flatMap((day) => day.places || []);
    const firstDay = draftDays[0] || { title: "", places: [] };
    const days = [
      {
        ...firstDay,
        date: nextDateMode === "fixed" ? infoForm.start || null : null,
        dayNumber: nextDateMode === "flexible" ? 1 : null,
        places: draftPlaces.map((place, order) => ({ ...place, order })),
      },
    ];
    if (
      nextDateMode === "fixed" &&
      infoForm.end &&
      infoForm.end !== infoForm.start
    ) {
      days.push({ date: infoForm.end, dayNumber: null, title: "", places: [] });
    }

    const oldFixedDates = dateRange(dates[0], dates.at(-1));
    const nextFixedDates = dateRange(infoForm.start, infoForm.end || infoForm.start);
    const convertedSchedule = (course.schedule || [])
      .map((day) => {
        const oldDayNumber =
          courseDateMode === "flexible"
            ? Number(day.dayNumber) || 1
            : Math.max(1, oldFixedDates.indexOf(dateValue(day.date)) + 1);
        if (nextDateMode === "flexible") {
          if (oldDayNumber > nextDurationDays) return null;
          return { ...day, date: null, dayNumber: oldDayNumber };
        }
        const nextDate = nextFixedDates[oldDayNumber - 1];
        return nextDate ? { ...day, date: nextDate, dayNumber: null } : null;
      })
      .filter(Boolean)
      .reduce((result, day) => {
        const key =
          nextDateMode === "flexible"
            ? `day:${day.dayNumber}`
            : `date:${dateValue(day.date)}`;
        const existing = result.find((item) => item.key === key);
        if (existing) existing.value.items.push(...(day.items || []));
        else result.push({ key, value: { ...day, items: [...(day.items || [])] } });
        return result;
      }, [])
      .map(({ value }) => ({
        ...value,
        items: value.items.sort((a, b) => a.time.localeCompare(b.time)),
      }));
    const body = {
      title: infoForm.title,
      description: infoForm.description,
      dateMode: nextDateMode,
      durationDays: nextDurationDays,
      days,
      schedule: convertedSchedule,
      visitPlan: (course.visitPlan || []).filter((plannedPlace) =>
        days
          .flatMap((day) => day.places || [])
          .some(
            (place) =>
              place.placeType === plannedPlace.placeType &&
              place.placeId === plannedPlace.placeId,
          ),
      ),
    };
    if (course.isOwner) body.visibility = infoForm.visibility;
    if (await patchCourse(body)) {
      setScheduleDateMode(nextDateMode === "flexible" ? "day" : "date");
      setPlanForm((previous) => ({ ...previous, date: "" }));
      setEditingInfo(false);
    }
  };
  const addDraftPlace = (result) => {
    const key = `${result.placeType}:${result.placeId}`;
    if (
      draftDays
        .flatMap((day) => day.places || [])
        .some((place) => `${place.placeType}:${place.placeId}` === key)
    )
      return;
    const next = structuredClone(draftDays);
    if (!next.length)
      next.push({
        date: infoForm.dateMode === "fixed" ? infoForm.start || null : null,
        dayNumber: infoForm.dateMode === "flexible" ? 1 : null,
        title: "",
        places: [],
      });
    next[0].places = [
      ...(next[0].places || []),
      {
        placeType: result.placeType,
        placeId: result.placeId,
        order: next[0].places?.length || 0,
        memo: "",
        place: result,
      },
    ];
    setDraftDays(next);
  };
  const addFavoritePlace = (favorite) =>
    addDraftPlace({
      ...favorite.place,
      placeType: favorite.placeType,
      placeId: favorite.placeId,
    });
  const removeDraftPlace = (target) =>
    setDraftDays(
      draftDays.map((day) => ({
        ...day,
        places: (day.places || [])
          .filter(
            (place) =>
              !(
                place.placeType === target.placeType &&
                place.placeId === target.placeId
              ),
          )
          .map((place, order) => ({ ...place, order })),
      })),
    );
  const updateVisitPlan = async (nextPlan) => {
    if (!course.canEdit || savingVisitPlan) return;
    setSavingVisitPlan(true);
    await patchCourse({
      visitPlan: nextPlan.map((place, order) => ({ ...place, order })),
    });
    setSavingVisitPlan(false);
  };
  const toggleVisitPlace = (place) => {
    const key = `${place.placeType}:${place.placeId}`;
    const current = course.visitPlan || [];
    const exists = current.some(
      (item) => `${item.placeType}:${item.placeId}` === key,
    );
    updateVisitPlan(
      exists
        ? current.filter((item) => `${item.placeType}:${item.placeId}` !== key)
        : [...current, place],
    );
  };
  const moveVisitPlace = (index, direction) => {
    const next = [...(course.visitPlan || [])];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateVisitPlan(next);
  };
  const addPlan = async (event) => {
    event.preventDefault();
    if (!planForm.date || !planForm.time || !planForm.title.trim()) return;
    const schedule = structuredClone(course.schedule || []);
    let day = schedule.find((item) =>
      courseDateMode === "flexible"
        ? Number(item.dayNumber) === Number(planForm.date)
        : dateValue(item.date) === planForm.date,
    );
    if (!day) {
      day =
        courseDateMode === "flexible"
          ? { date: null, dayNumber: Number(planForm.date), items: [] }
          : { date: planForm.date, dayNumber: null, items: [] };
      schedule.push(day);
    }
    day.items.push({
      time: planForm.time,
      title: planForm.title.trim(),
      ...(planForm.placeKey
        ? (() => {
            const [placeType, placeId] = planForm.placeKey.split(":");
            return { placeType, placeId: Number(placeId) };
          })()
        : {}),
      memo: planForm.memo.trim(),
    });
    day.items.sort((a, b) => a.time.localeCompare(b.time));
    schedule.sort((a, b) =>
      courseDateMode === "flexible"
        ? Number(a.dayNumber) - Number(b.dayNumber)
        : dateValue(a.date).localeCompare(dateValue(b.date)),
    );
    if (await patchCourse({ schedule }))
      setPlanForm({
        date: planForm.date,
        time: "",
        title: "",
        placeKey: "",
        memo: "",
      });
  };
  const removePlan = async (dayIndex, itemIndex) => {
    const schedule = structuredClone(course.schedule || []);
    schedule[dayIndex].items.splice(itemIndex, 1);
    await patchCourse({ schedule: schedule.filter((day) => day.items.length) });
  };
  const updateChecklistCourse = (updated) =>
    setCourse((previous) => ({
      ...previous,
      ...updated,
      isOwner: previous.isOwner,
      canEdit: previous.canEdit,
    }));
  const addChecklist = async (event) => {
    event.preventDefault();
    if (!checkText.trim()) return;
    try {
      const updated = await memberApi(`/itineraries/${id}/checklist`, {
        method: "POST",
        body: {
          text: checkText.trim(),
          scope: checklistCategory === "common" ? "common" : "personal",
        },
      });
      updateChecklistCourse(updated);
      setCheckText("");
    } catch {
      setError(labels.saveError);
    }
  };
  const toggleChecklist = async (item) => {
    try {
      updateChecklistCourse(
        await memberApi(`/itineraries/${id}/checklist/${item._id}`, {
          method: "PATCH",
          body: { checked: !item.checked },
        }),
      );
    } catch {
      setError(labels.saveError);
    }
  };
  const deleteChecklist = async (item) => {
    try {
      updateChecklistCourse(
        await memberApi(`/itineraries/${id}/checklist/${item._id}`, {
          method: "DELETE",
        }),
      );
    } catch {
      setError(labels.saveError);
    }
  };
  const saveEditPassword = async (event) => {
    event.preventDefault();
    setError("");
    setAccessMessage("");
    try {
      await memberApi(`/itineraries/${id}/edit-password`, {
        method: "PUT",
        body: { password: editPassword },
      });
      setCourse((previous) => ({ ...previous, hasEditPassword: true }));
      setEditPassword("");
      setAccessMessage(labels.save);
    } catch {
      setError(labels.saveError);
    }
  };
  const joinEditing = async (event) => {
    event.preventDefault();
    setError("");
    setAccessMessage("");
    try {
      const updated = await memberApi(`/itineraries/${id}/edit-access`, {
        method: "POST",
        body: { password: editPassword },
      });
      setCourse((previous) => ({ ...previous, ...updated, canEdit: true }));
      setEditPassword("");
      setAccessMessage(labels.joined);
    } catch (requestError) {
      setError(
        requestError.status === 403 ? labels.wrongPassword : labels.saveError,
      );
    }
  };
  const removeEditor = async (userId) => {
    const updated = await memberApi(`/itineraries/${id}/editors/${userId}`, {
      method: "DELETE",
    });
    setCourse((previous) => ({ ...previous, editors: updated.editors }));
  };

  if (loading)
    return (
      <>
        <Header />
        <main className="courseDetailStatus">Loading...</main>
        <Footer />
      </>
    );
  if (!course)
    return (
      <>
        <Header />
        <main className="courseDetailStatus">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>{labels.back}</button>
        </main>
        <Footer />
      </>
    );
  const collaboratorLabel = course.isOwner
    ? labels.registeredMembers
    : labels.editors;
  const nav = [
    ["info", labels.info],
    ["schedule", labels.schedule],
    ["checklist", labels.checklist],
    ["editors", collaboratorLabel],
  ];
  const currentUserId = String(session?.user?.id || "");
  const checklistCategories = [
    { id: "common", label: labels.common },
    ...(course.owner
      ? [{ id: String(course.owner._id), label: labels.author }]
      : []),
    ...(course.editors || []).map((editor, index) => ({
      id: String(editor._id),
      label: editor.displayName || `${labels.registeredMember} ${index + 1}`,
    })),
  ];
  const visibleChecklist = (course.checklist || []).filter((item) =>
    checklistCategory === "common"
      ? !item.ownerId
      : String(item.ownerId) === checklistCategory,
  );
  const canManageChecklist = Boolean(
    course.canEdit &&
    (checklistCategory === "common" || checklistCategory === currentUserId),
  );
  return (
    <>
      <Header />
      <main className="courseDetailPage">
        <section className="courseHero bannerImg">
          {cover ? (
            <img src={placeImageUrl(cover.place)} alt="" />
          ) : (
            <div className="courseHeroFallback" />
          )}
          <div className="courseHeroShade" />
          <div className="courseHeroCopy contentWidth">
            <span className={`courseVisibility ${course.visibility}`}>
              {labels[course.visibility]}
            </span>
            <h1>{course.title}</h1>
            <p>
              {courseDateMode === "flexible"
                ? `DAY ${durationDays}`
                : dates.length
                  ? `${dates[0]} ~ ${dates.at(-1)}`
                  : labels.period}
            </p>
          </div>
        </section>
        <div className="courseDashboard contentWidth">
          <aside className="courseSideNav" aria-label="Course detail sections">
            {nav.map(([key, label]) => (
              <button
                key={key}
                className={active === key ? "active" : ""}
                onClick={() => setActive(key)}
              >
                {label}
              </button>
            ))}
          </aside>
          <nav className="courseMobileNav" aria-label="Course detail sections">
            {nav.map(([key, label]) => (
              <button
                key={key}
                className={active === key ? "active" : ""}
                onClick={() => setActive(key)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="coursePanel">
            {error && <p className="courseError">{error}</p>}
            {active === "info" && (
              <section>
                <div className="courseSectionHeading">
                  <div>
                    <span>OVERVIEW</span>
                    <h2>{labels.info}</h2>
                  </div>
                  {course.canEdit && !editingInfo && (
                    <button className="primaryButton" onClick={beginInfoEdit}>
                      {labels.edit}
                    </button>
                  )}
                </div>
                {editingInfo ? (
                  <form className="courseInfoForm" onSubmit={saveInfo}>
                    <label>
                      {labels.title}
                      <input
                        value={infoForm.title}
                        maxLength="100"
                        required
                        onChange={(e) =>
                          setInfoForm({ ...infoForm, title: e.target.value })
                        }
                      />
                    </label>
                    {course.isOwner ? (
                      <label>
                        {labels.visibility}
                        <SelectWithChevron
                          value={infoForm.visibility}
                          onChange={(e) =>
                            setInfoForm({
                              ...infoForm,
                              visibility: e.target.value,
                            })
                          }
                        >
                          <option value="private">{labels.private}</option>
                          <option value="unlisted">{labels.unlisted}</option>
                          <option value="public">{labels.public}</option>
                        </SelectWithChevron>
                      </label>
                    ) : (
                      <label>
                        {labels.visibility}
                        <input value={labels[course.visibility]} disabled />
                      </label>
                    )}
                    <label className="wide">
                      {labels.description}
                      <textarea
                        value={infoForm.description}
                        maxLength="2000"
                        onChange={(e) =>
                          setInfoForm({
                            ...infoForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </label>
                    <fieldset className="courseDateStatusEditor wide">
                      <legend>{labels.dateStatus}</legend>
                      <div>
                        {[
                          { value: "fixed", label: labels.dateFixed },
                          { value: "flexible", label: labels.dateFlexible },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={
                              infoForm.dateMode === option.value ? "active" : ""
                            }
                          >
                            <input
                              type="radio"
                              name="detailDateMode"
                              value={option.value}
                              checked={infoForm.dateMode === option.value}
                              onChange={(event) =>
                                setInfoForm({
                                  ...infoForm,
                                  dateMode: event.target.value,
                                })
                              }
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    {infoForm.dateMode === "fixed" ? (
                      <>
                        <label>
                          {labels.start}
                          <input
                            type="date"
                            value={infoForm.start}
                            onChange={(e) =>
                              setInfoForm({
                                ...infoForm,
                                start: e.target.value,
                                end:
                                  infoForm.end && infoForm.end < e.target.value
                                    ? e.target.value
                                    : infoForm.end,
                              })
                            }
                          />
                        </label>
                        <label>
                          {labels.end}
                          <input
                            type="date"
                            min={infoForm.start}
                            value={infoForm.end}
                            onChange={(e) =>
                              setInfoForm({ ...infoForm, end: e.target.value })
                            }
                          />
                        </label>
                      </>
                    ) : (
                      <label>
                        {labels.tripDays}
                        <SelectWithChevron
                          value={infoForm.durationDays}
                          onChange={(event) =>
                            setInfoForm({
                              ...infoForm,
                              durationDays: Number(event.target.value),
                            })
                          }
                        >
                          {Array.from({ length: 31 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                              DAY {index + 1}
                            </option>
                          ))}
                        </SelectWithChevron>
                      </label>
                    )}
                    <div className="coursePlaceEditor wide">
                      <div className="coursePlaceEditorHeader">
                        <h3>{labels.places}</h3>
                        <div
                          className="coursePlaceModeSwitch"
                          role="group"
                          aria-label={labels.places}
                        >
                          <button
                            type="button"
                            className={
                              placePickerMode === "search" ? "active" : ""
                            }
                            aria-pressed={placePickerMode === "search"}
                            onClick={() => setPlacePickerMode("search")}
                          >
                            {labels.searchMode}
                          </button>
                          <button
                            type="button"
                            className={
                              placePickerMode === "favorites" ? "active" : ""
                            }
                            aria-pressed={placePickerMode === "favorites"}
                            onClick={() => setPlacePickerMode("favorites")}
                          >
                            {labels.favoritesMode}
                          </button>
                        </div>
                      </div>
                      {placePickerMode === "search" ? (
                        <>
                          <div className="placeSearchBox">
                            <input
                              value={placeSearch}
                              placeholder={labels.placeSearch}
                              onChange={(e) => setPlaceSearch(e.target.value)}
                            />
                          </div>
                          {placeSearch.trim() && (
                            <ul className="placeSearchResults">
                              {placeResults.length ? (
                                placeResults.map((result) => {
                                  const added = draftPlaceKeys.has(
                                    placeKey(result),
                                  );
                                  return (
                                    <li
                                      key={`${result.placeType}:${result.placeId}`}
                                    >
                                      <span>{placeName(result, lang)}</span>
                                      <button
                                        type="button"
                                        disabled={added}
                                        onClick={() => addDraftPlace(result)}
                                      >
                                        {added
                                          ? labels.addedPlace
                                          : labels.addPlace}
                                      </button>
                                    </li>
                                  );
                                })
                              ) : (
                                <li className="noResult">
                                  {labels.noPlaceResult}
                                </li>
                              )}
                            </ul>
                          )}
                        </>
                      ) : (
                        <div className="courseFavoritePicker">
                          <SelectWithChevron
                            className="courseFavoriteRegionControl"
                            value={favoriteRegion}
                            aria-label={labels.selectRegion}
                            onChange={(event) => {
                              setFavoriteRegion(event.target.value);
                            }}
                          >
                            <option value="ALL">{labels.allRegions}</option>
                            {FAVORITE_REGION_ORDER.map((code) => (
                              <option key={code} value={code}>
                                {
                                  FAVORITE_REGION_LABELS[code][
                                    lang === "ko" ? "ko" : "en"
                                  ]
                                }
                              </option>
                            ))}
                          </SelectWithChevron>
                          {favoritesLoading ? (
                            <p className="courseFavoriteEmpty">
                              {labels.favoritesLoading}
                            </p>
                          ) : favoritePagination.pagedList.length ? (
                            <ul className="courseFavoriteList">
                              {favoritePagination.pagedList.map((favorite) => {
                                const added = draftPlaceKeys.has(
                                  placeKey(favorite),
                                );
                                const regionCode =
                                  favorite.place?.location?.region?.code;
                                return (
                                  <li key={favorite._id || placeKey(favorite)}>
                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={added}
                                        onChange={(event) =>
                                          event.target.checked
                                            ? addFavoritePlace(favorite)
                                            : removeDraftPlace(favorite)
                                        }
                                      />
                                      <span>
                                        <strong>
                                          {placeName(favorite, lang)}
                                        </strong>
                                      </span>
                                    </label>
                                    <em>
                                      {FAVORITE_REGION_LABELS[regionCode]?.[
                                        lang === "ko" ? "ko" : "en"
                                      ] || placeRegion(favorite, lang)}
                                    </em>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="courseFavoriteEmpty">
                              {favorites.length
                                ? labels.emptyFavoriteRegion
                                : labels.noFavorites}
                            </p>
                          )}
                          {favoritePagination.totalPages > 1 && (
                            <nav
                              className="courseFavoritePagination"
                              aria-label={labels.favoritesPages}
                            >
                              <button
                                type="button"
                                disabled={favoritePagination.currentPage === 1}
                                aria-label={labels.previousPage}
                                onClick={() =>
                                  favoritePagination.handlePageChange(
                                    favoritePagination.currentPage - 1,
                                  )
                                }
                              >
                                ‹
                              </button>
                              <span>
                                {favoritePagination.currentPage} /{" "}
                                {favoritePagination.totalPages}
                              </span>
                              <button
                                type="button"
                                disabled={
                                  favoritePagination.currentPage ===
                                  favoritePagination.totalPages
                                }
                                aria-label={labels.nextPage}
                                onClick={() =>
                                  favoritePagination.handlePageChange(
                                    favoritePagination.currentPage + 1,
                                  )
                                }
                              >
                                ›
                              </button>
                            </nav>
                          )}
                        </div>
                      )}
                      <ul className="draftPlaceList">
                        {draftDays
                          .flatMap((day) => day.places || [])
                          .map((place) => (
                            <li key={`${place.placeType}:${place.placeId}`}>
                              <span>{placeName(place, lang)}</span>
                              <div className="placeOrderButtons">
                                <button
                                  type="button"
                                  className="removePlaceButton"
                                  onClick={() => removeDraftPlace(place)}
                                >
                                  {labels.removePlace}
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="formButtons wide">
                      <button
                        type="button"
                        onClick={() => setEditingInfo(false)}
                      >
                        {labels.cancel}
                      </button>
                      <button className="primaryButton">{labels.save}</button>
                    </div>
                  </form>
                ) : (
                  <div className="courseOverview">
                    <article>
                      <h3>{labels.description}</h3>
                      <p>{course.description || labels.noDescription}</p>
                    </article>
                    <article>
                      <h3>{labels.period}</h3>
                      <p>
                        {courseDateMode === "flexible"
                          ? `DAY ${durationDays}`
                          : dates.length
                            ? `${dates[0]} ~ ${dates.at(-1)}`
                            : "-"}
                      </p>
                    </article>
                  </div>
                )}
                <h3 className="subheading">{labels.places}</h3>
                {places.length ? (
                  <ul className="coursePlaceList courseAllPlaceList">
                    {places.map((place) => {
                      const selected = (course.visitPlan || []).some(
                        (item) =>
                          item.placeType === place.placeType &&
                          item.placeId === place.placeId,
                      );
                      return (
                        <li key={`${place.placeType}:${place.placeId}`}>
                          {course.canEdit && (
                            <input
                              type="checkbox"
                              checked={selected}
                              disabled={savingVisitPlan}
                              aria-label={`${placeName(place, lang)} ${labels.addToVisitPlan}`}
                              onChange={() => toggleVisitPlace(place)}
                            />
                          )}
                          <Link
                            to={placePath(
                              place.placeType,
                              place.placeId,
                              place.place?.source,
                            )}
                          >
                            {placeName(place, lang)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="courseDetailEmpty">{labels.noPlaces}</div>
                )}
                <div className="visitPlanHeading">
                  <h3 className="subheading">{labels.visitPlan}</h3>
                  <p>{labels.visitPlanHint}</p>
                </div>
                {(course.visitPlan || []).length ? (
                  <ol className="coursePlaceList visitPlanList">
                    {(course.visitPlan || []).map(
                      (place, index, orderedPlaces) => (
                        <li key={`${place.placeType}:${place.placeId}`}>
                          <span>{index + 1}</span>
                          <Link
                            to={placePath(
                              place.placeType,
                              place.placeId,
                              place.place?.source,
                            )}
                          >
                            {placeName(place, lang)}
                          </Link>
                          {course.canEdit && (
                            <div className="visitOrderButtons">
                              <button
                                disabled={savingVisitPlan || index === 0}
                                onClick={() => moveVisitPlace(index, -1)}
                              >
                                ↑ {labels.moveUp}
                              </button>
                              <button
                                disabled={
                                  savingVisitPlan ||
                                  index === orderedPlaces.length - 1
                                }
                                onClick={() => moveVisitPlace(index, 1)}
                              >
                                ↓ {labels.moveDown}
                              </button>
                              <button
                                disabled={savingVisitPlan}
                                onClick={() => toggleVisitPlace(place)}
                              >
                                {labels.remove}
                              </button>
                            </div>
                          )}
                        </li>
                      ),
                    )}
                  </ol>
                ) : (
                  <div className="courseDetailEmpty">{labels.noVisitPlan}</div>
                )}
                <h3 className="subheading">{labels.map}</h3>
                <CourseMap
                  allPlaces={places}
                  visitPlan={course.visitPlan || []}
                  lang={lang}
                  labels={labels}
                />
              </section>
            )}
            {active === "schedule" && (
              <section>
                <div className="courseSectionHeading">
                  <div>
                    <span>DAILY PLAN</span>
                    <h2>{labels.schedule}</h2>
                    <p>{labels.scheduleHint}</p>
                  </div>
                </div>
                {course.canEdit && (
                  <form
                    className="planForm"
                    onSubmit={(event) => event.preventDefault()}
                  >
                    <div className="scheduleDatePicker">
                      <div
                        className="scheduleDateModes"
                        role="group"
                        aria-label={labels.date}
                      >
                        <button
                          type="button"
                          className={scheduleDateMode === "date" ? "active" : ""}
                          aria-pressed={scheduleDateMode === "date"}
                          disabled={courseDateMode === "flexible"}
                          onClick={() => changeScheduleDateMode("date")}
                        >
                          {labels.dateInputMode}
                        </button>
                        <button
                          type="button"
                          className={scheduleDateMode === "day" ? "active" : ""}
                          aria-pressed={scheduleDateMode === "day"}
                          disabled={!scheduleDayOptions.length}
                          onClick={() => changeScheduleDateMode("day")}
                        >
                          {labels.dayInputMode}
                        </button>
                      </div>
                      {courseDateMode === "fixed" && scheduleDateMode === "date" ? (
                        <input
                          aria-label={labels.dateInputMode}
                          type="date"
                          min={dates[0]}
                          max={dates.at(-1)}
                          value={planForm.date}
                          required
                          onChange={(e) =>
                            setPlanForm({ ...planForm, date: e.target.value })
                          }
                        />
                      ) : (
                        <SelectWithChevron
                          aria-label={labels.dayInputMode}
                          value={planForm.date}
                          required
                          onChange={(e) =>
                            setPlanForm({ ...planForm, date: e.target.value })
                          }
                        >
                          {scheduleDayOptions.map((date, index) => (
                            <option key={date} value={date}>
                              DAY {index + 1}
                            </option>
                          ))}
                        </SelectWithChevron>
                      )}
                    </div>
                    <input
                      aria-label={labels.time}
                      type="time"
                      value={planForm.time}
                      required
                      onChange={(e) =>
                        setPlanForm({ ...planForm, time: e.target.value })
                      }
                    />
                    <input
                      className="planTitleInput"
                      aria-label={labels.plan}
                      placeholder={labels.plan}
                      value={planForm.title}
                      required
                      onChange={(e) =>
                        setPlanForm({ ...planForm, title: e.target.value })
                      }
                    />
                    <SelectWithChevron
                      aria-label={labels.place}
                      value={planForm.placeKey}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, placeKey: e.target.value })
                      }
                    >
                      <option value="">{labels.place}</option>
                      {(course.visitPlan || []).map((place) => (
                        <option
                          key={`${place.placeType}:${place.placeId}`}
                          value={`${place.placeType}:${place.placeId}`}
                        >
                          {placeName(place, lang)}
                        </option>
                      ))}
                    </SelectWithChevron>
                    <textarea
                      className="planMemoInput"
                      aria-label={labels.memo}
                      placeholder={labels.memo}
                      value={planForm.memo}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, memo: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="primaryButton"
                      onClick={addPlan}
                    >
                      + {labels.addPlan}
                    </button>
                  </form>
                )}
                {(course.schedule || []).length ? (
                  <div className="scheduleDays">
                    {course.schedule.map((day, dayIndex) => (
                      <article key={day._id || day.date || `day-${day.dayNumber}`}>
                        <h3>
                          {courseDateMode === "flexible"
                            ? `DAY ${day.dayNumber || dayIndex + 1}`
                            : dateValue(day.date)}
                        </h3>
                        {day.items.map((item, itemIndex) => (
                          <div
                            className="scheduleRow"
                            key={item._id || `${item.time}-${itemIndex}`}
                          >
                            <time>{item.time}</time>
                            <div>
                              <strong>{item.title}</strong>
                              {item.placeType && (
                                <span className="schedulePlace">
                                  {placeName(
                                    (course.visitPlan || []).find(
                                      (place) =>
                                        place.placeType === item.placeType &&
                                        place.placeId === item.placeId,
                                    ),
                                    lang,
                                  )}
                                </span>
                              )}
                              {item.memo && <p>{item.memo}</p>}
                            </div>
                            {course.canEdit && (
                              <button
                                onClick={() => removePlan(dayIndex, itemIndex)}
                                aria-label={labels.remove}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="courseDetailEmpty">
                    {labels.emptySchedule}
                  </div>
                )}
              </section>
            )}
            {active === "checklist" && (
              <section>
                <div className="courseSectionHeading">
                  <div>
                    <span>PACKING</span>
                    <h2>{labels.checklist}</h2>
                    <p>{labels.checklistHint}</p>
                  </div>
                </div>
                <nav
                  className="checklistCategories"
                  aria-label={labels.checklist}
                >
                  {checklistCategories.map((category) => (
                    <button
                      key={category.id}
                      className={
                        checklistCategory === category.id ? "active" : ""
                      }
                      onClick={() => {
                        setChecklistCategory(category.id);
                        setCheckText("");
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </nav>
                {checklistCategory !== "common" && (
                  <p className="personalChecklistHint">
                    {labels.personalChecklistHint}
                  </p>
                )}
                {canManageChecklist && (
                  <form className="checkForm" onSubmit={addChecklist}>
                    <input
                      value={checkText}
                      placeholder={labels.checklistPlaceholder}
                      onChange={(e) => setCheckText(e.target.value)}
                    />
                    <button className="primaryButton">{labels.add}</button>
                  </form>
                )}
                {visibleChecklist.length ? (
                  <ul className="checkList">
                    {visibleChecklist.map((item) => (
                      <li
                        key={item._id}
                        className={item.checked ? "checked" : ""}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            disabled={!canManageChecklist}
                            onChange={() => toggleChecklist(item)}
                          />
                          <span>{item.text}</span>
                        </label>
                        {canManageChecklist && (
                          <button onClick={() => deleteChecklist(item)}>
                            {labels.remove}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="courseDetailEmpty">
                    {labels.emptyChecklist}
                  </div>
                )}
              </section>
            )}
            {active === "editors" && (
              <section>
                <div className="courseSectionHeading">
                  <div>
                    <span>COLLABORATION</span>
                    <h2>{collaboratorLabel}</h2>
                    <p>
                      {course.isOwner
                        ? labels.editorHint
                        : course.canEdit
                          ? labels.registeredHint
                          : labels.joinHint}
                    </p>
                  </div>
                </div>
                {(course.isOwner ||
                  (session?.authenticated && !course.canEdit)) && (
                  <>
                    <form
                      className="checkForm"
                      onSubmit={course.isOwner ? saveEditPassword : joinEditing}
                    >
                      <input
                        type="password"
                        minLength="4"
                        maxLength="32"
                        autoComplete="new-password"
                        required
                        value={editPassword}
                        placeholder={labels.passwordPlaceholder}
                        onChange={(e) => setEditPassword(e.target.value)}
                      />
                      <button className="primaryButton">
                        {course.isOwner ? labels.setPassword : labels.join}
                      </button>
                    </form>
                    <p className="passwordUsage">{labels.passwordUsage}</p>
                  </>
                )}
                {accessMessage && (
                  <p className="accessMessage">{accessMessage}</p>
                )}
                {course.isOwner && course.editors?.length ? (
                  <ul className="editorList">
                    {course.editors.map((editor) => (
                      <li key={editor._id}>
                        <span className="editorAvatar">
                          {editor.displayName?.[0] || "K"}
                        </span>
                        <div>
                          <strong>
                            {editor.displayName || "KORTRIP Member"}
                          </strong>
                        </div>
                        <button onClick={() => removeEditor(editor._id)}>
                          {labels.revoke}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : course.isOwner ? (
                  <div className="courseDetailEmpty">{labels.noEditors}</div>
                ) : null}
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
