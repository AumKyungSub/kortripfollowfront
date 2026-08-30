import { useEffect, useState } from "react";
import { memberApi } from "@/shared/api/memberApi";
import "./TourApiDraftManager.style.css";

const regionOptions = [
  { code: "SEOUL", ko: "서울", en: "Seoul" },
  { code: "GGICN", ko: "경기도 / 인천", en: "Gyeonggi / Incheon" },
  { code: "GANGWON", ko: "강원특별자치도", en: "Gangwon" },
  { code: "CCDAEJEON", ko: "충청도", en: "Chungcheong" },
  { code: "GSBUSANDAEGUULSAN", ko: "경상도", en: "Gyeongsang" },
  { code: "JRGWANGJU", ko: "전라도", en: "Jeolla" },
  { code: "JEJU", ko: "제주도", en: "Jeju Island" },
  { code: "OTHER", ko: "기타", en: "Other" },
];

const emptyRoutePoint = () => ({
  name: { ko: "", en: "" },
  address: { ko: "", en: "" },
  latitude: "",
  longitude: "",
});

const toRoutePoint = point => ({
  name: { ko: point?.name?.ko || "", en: point?.name?.en || "" },
  address: { ko: point?.address?.ko || "", en: point?.address?.en || "" },
  latitude: point?.latitude ?? "",
  longitude: point?.longitude ?? "",
});

const toDriveRoute = draft => ({
  start: draft?.driveRoute?.start
    ? toRoutePoint(draft.driveRoute.start)
    : {
        ...emptyRoutePoint(),
        name: { ko: draft?.name || "", en: draft?.nameEn || "" },
        address: { ko: draft?.address || "", en: draft?.addressEn || "" },
        latitude: draft?.coordinates?.latitude ?? "",
        longitude: draft?.coordinates?.longitude ?? "",
      },
  waypoints: (draft?.driveRoute?.waypoints || []).map(waypoint => ({
    name: { ko: waypoint?.name?.ko || "", en: waypoint?.name?.en || "" },
    latitude: waypoint?.latitude ?? "",
    longitude: waypoint?.longitude ?? "",
    googleEnabled: waypoint?.googleEnabled !== false,
  })),
  destination: toRoutePoint(draft?.driveRoute?.destination),
  routePathText: (draft?.driveRoute?.routePath || [])
    .map(point => `${point.latitude},${point.longitude}`)
    .join("\n"),
});

const toForm = draft => ({
  placeType: draft?.placeType || "attraction",
  name: draft?.name || "",
  nameEn: draft?.nameEn || "",
  address: draft?.address || "",
  addressEn: draft?.addressEn || "",
  regionCode: draft?.regionCode || "OTHER",
  shortDescription: draft?.shortDescription || "",
  shortDescriptionEn: draft?.shortDescriptionEn || "",
  description: draft?.description || "",
  descriptionEn: draft?.descriptionEn || "",
  homepage: draft?.officialLinks?.homepage || "",
  instagram: draft?.officialLinks?.instagram || "",
  latitude: draft?.coordinates?.latitude ?? "",
  longitude: draft?.coordinates?.longitude ?? "",
  driveRoute: toDriveRoute(draft),
});

const routePathFromText = value => value
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean)
  .map(line => {
    const [latitude = "", longitude = ""] = line.split(",").map(part => part.trim());
    return { latitude, longitude };
  });

const driveRoutePayload = driveRoute => ({
  start: driveRoute.start,
  waypoints: driveRoute.waypoints,
  destination: driveRoute.destination,
  routePath: routePathFromText(driveRoute.routePathText),
  routeSource: "OpenStreetMap",
});

const geoDistanceMeters = (first, second) => {
  const radius = 6371000;
  const toRadians = value => value * Math.PI / 180;
  const latitude1 = toRadians(first.latitude);
  const latitude2 = toRadians(second.latitude);
  const latitudeDelta = latitude2 - latitude1;
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(Math.min(1, haversine)));
};

const geoJsonLineStrings = document => {
  if (document?.type === "Feature" && document.geometry?.type === "LineString") {
    return [document.geometry.coordinates];
  }
  if (document?.type === "LineString") return [document.coordinates];
  if (document?.type === "FeatureCollection") {
    const lines = document.features
      ?.filter(feature => feature?.geometry?.type === "LineString")
      .map(feature => feature.geometry.coordinates) || [];
    if (lines.length) return lines;
  }
  throw new Error("LineString 형식의 GeoJSON만 사용할 수 있습니다.");
};

const normalizedGeoJsonLine = coordinates => {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("각 GeoJSON 구간에는 좌표가 2개 이상 있어야 합니다.");
  }
  return coordinates.map(coordinate => {
    const longitude = Number(coordinate?.[0]);
    const latitude = Number(coordinate?.[1]);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
      || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new Error("GeoJSON에 올바르지 않은 위도·경도가 있습니다.");
    }
    return { latitude, longitude };
  });
};

const mergeGeoJsonLines = lines => {
  const merged = [];
  const waypoints = [];
  if (lines.length > 6) {
    throw new Error("출발·도착 구간을 포함해 GeoJSON 구간은 최대 6개까지 병합할 수 있습니다.");
  }
  lines.forEach((originalLine, index) => {
    let line = normalizedGeoJsonLine(originalLine);
    if (index > 0) {
      const previous = merged[merged.length - 1];
      const startDistance = geoDistanceMeters(previous, line[0]);
      const endDistance = geoDistanceMeters(previous, line[line.length - 1]);
      if (endDistance < startDistance) line = [...line].reverse();
      const connectionDistance = geoDistanceMeters(previous, line[0]);
      if (connectionDistance > 100) {
        throw new Error(`GeoJSON ${index + 1}번째 구간이 이전 구간과 ${Math.round(connectionDistance)}m 떨어져 있습니다.`);
      }
      waypoints.push({
        name: { ko: `경유지 ${index}`, en: `Waypoint ${index}` },
        latitude: String(line[0].latitude),
        longitude: String(line[0].longitude),
        googleEnabled: index <= 3,
      });
      if (connectionDistance <= 5) line = line.slice(1);
    }
    merged.push(...line);
  });
  if (merged.length > 20000) throw new Error("병합된 경로 좌표는 최대 20,000개까지 사용할 수 있습니다.");
  return { merged, waypoints };
};

const TourApiDraftManager = ({ refreshRequest, source = "tourApi" }) => {
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(toForm());
  const [geoJsonImport, setGeoJsonImport] = useState({ loading: false, error: "", files: [], points: 0, waypoints: 0 });
  const [status, setStatus] = useState({ loading: true, saving: false, publishing: false, deleting: false, error: "", saved: false });

  const loadDrafts = async (focusExternalId = "") => {
    try {
      const data = await memberApi(`/operator/external-places?source=${source}`);
      const items = data || [];
      setDrafts(items);
      if (focusExternalId) {
        const savedPlace = items.find(item => item.externalId === focusExternalId);
        if (savedPlace) {
          setSelected(savedPlace);
          setForm(toForm(savedPlace));
        }
      } else {
        setSelected(null);
        setForm(toForm());
      }
      setStatus(value => ({ ...value, loading: false, error: "" }));
    } catch (error) {
      setStatus(value => ({ ...value, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    setStatus(value => ({ ...value, loading: true, error: "", saved: false }));
    loadDrafts(refreshRequest?.externalId || "");
  }, [refreshRequest?.version, source]);

  const chooseDraft = draft => {
    setSelected(draft);
    setForm(toForm(draft));
    setGeoJsonImport({ loading: false, error: "", files: [], points: draft?.driveRoute?.routePath?.length || 0, waypoints: draft?.driveRoute?.waypoints?.length || 0 });
    setStatus(value => ({ ...value, error: "", saved: false }));
  };

  const createManualDraft = async () => {
    if (source !== "manual" || status.saving) return;
    setStatus(value => ({ ...value, saving: true, error: "", saved: false }));
    try {
      const draft = await memberApi("/operator/manual-places/draft", { method: "POST" });
      await loadDrafts(draft.externalId);
      setStatus(value => ({ ...value, saving: false, error: "" }));
    } catch (error) {
      setStatus(value => ({ ...value, saving: false, error: error.message }));
    }
  };

  const update = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));

  const updateRoutePoint = (section, field, value, lang) => setForm(current => ({
    ...current,
    driveRoute: {
      ...current.driveRoute,
      [section]: {
        ...current.driveRoute[section],
        [field]: lang
          ? { ...current.driveRoute[section][field], [lang]: value }
          : value,
      },
    },
  }));

  const updateWaypoint = (index, field, value, lang) => setForm(current => ({
    ...current,
    driveRoute: {
      ...current.driveRoute,
      waypoints: current.driveRoute.waypoints.map((waypoint, waypointIndex) => waypointIndex === index
        ? {
            ...waypoint,
            [field]: lang ? { ...waypoint[field], [lang]: value } : value,
          }
        : waypoint),
    },
  }));

  const addWaypoint = () => setForm(current => current.driveRoute.waypoints.length >= 5 ? current : ({
    ...current,
    driveRoute: {
      ...current.driveRoute,
      waypoints: [
        ...current.driveRoute.waypoints,
        { name: { ko: "", en: "" }, latitude: "", longitude: "", googleEnabled: false },
      ],
    },
  }));

  const removeWaypoint = index => setForm(current => ({
    ...current,
    driveRoute: {
      ...current.driveRoute,
      waypoints: current.driveRoute.waypoints.filter((_, waypointIndex) => waypointIndex !== index),
    },
  }));

  const updateRoutePath = event => setForm(current => ({
    ...current,
    driveRoute: { ...current.driveRoute, routePathText: event.target.value },
  }));

  const importGeoJson = async event => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || geoJsonImport.loading) return;
    setGeoJsonImport({ loading: true, error: "", files: files.map(file => file.name), points: 0, waypoints: 0 });
    try {
      const documents = await Promise.all(files.map(async file => {
        if (file.size > 10 * 1024 * 1024) throw new Error(`${file.name} 파일이 10MB를 초과합니다.`);
        try {
          return JSON.parse(await file.text());
        } catch {
          throw new Error(`${file.name} 파일의 JSON 형식이 올바르지 않습니다.`);
        }
      }));
      const lines = documents.flatMap(geoJsonLineStrings);
      const { merged, waypoints } = mergeGeoJsonLines(lines);
      const start = merged[0];
      const destination = merged[merged.length - 1];
      setForm(current => ({
        ...current,
        driveRoute: {
          ...current.driveRoute,
          waypoints,
          start: {
            ...current.driveRoute.start,
            latitude: String(start.latitude),
            longitude: String(start.longitude),
          },
          destination: {
            ...current.driveRoute.destination,
            latitude: String(destination.latitude),
            longitude: String(destination.longitude),
          },
          routePathText: merged.map(point => `${point.latitude},${point.longitude}`).join("\n"),
        },
      }));
      setGeoJsonImport({ loading: false, error: "", files: files.map(file => file.name), points: merged.length, waypoints: waypoints.length });
    } catch (error) {
      setGeoJsonImport({ loading: false, error: error.message, files: files.map(file => file.name), points: 0, waypoints: 0 });
    }
  };

  const save = async event => {
    event.preventDefault();
    if (!selected?._id || status.saving) return;
    setStatus(value => ({ ...value, saving: true, error: "", saved: false }));
    try {
      const body = form.placeType === "drive"
        ? { ...form, driveRoute: driveRoutePayload(form.driveRoute) }
        : form;
      const updated = await memberApi(`/operator/external-places/${selected._id}`, { method: "PATCH", body });
      setSelected(updated);
      setForm(toForm(updated));
      setDrafts(items => items.map(item => item._id === updated._id ? updated : item));
      setStatus(value => ({ ...value, saving: false, saved: true, publishedId: null }));
    } catch (error) {
      setStatus(value => ({ ...value, saving: false, error: error.message, saved: false }));
    }
  };

  const missingFields = [
    !form.name.trim() && "한국어 이름",
    !form.nameEn.trim() && "영어 이름",
    !form.address.trim() && "한국어 주소",
    !form.addressEn.trim() && "영어 주소",
    !form.regionCode.trim() && "지역",
    !form.shortDescription.trim() && "한국어 짧은 소개",
    !form.shortDescriptionEn.trim() && "영어 짧은 소개",
    !form.description.trim() && "한국어 상세 설명",
    !form.descriptionEn.trim() && "영어 상세 설명",
    source === "manual" && form.placeType !== "drive" && form.latitude === "" && "위도",
    source === "manual" && form.placeType !== "drive" && form.longitude === "" && "경도",
    form.placeType === "drive" && form.driveRoute.start.name.ko.trim() === "" && "드라이브 출발지 한국어 이름",
    form.placeType === "drive" && form.driveRoute.start.name.en.trim() === "" && "드라이브 출발지 영어 이름",
    form.placeType === "drive" && form.driveRoute.start.address.ko.trim() === "" && "드라이브 출발지 한국어 주소",
    form.placeType === "drive" && form.driveRoute.start.address.en.trim() === "" && "드라이브 출발지 영어 주소",
    form.placeType === "drive" && form.driveRoute.start.latitude === "" && "드라이브 출발지 위도",
    form.placeType === "drive" && form.driveRoute.start.longitude === "" && "드라이브 출발지 경도",
    form.placeType === "drive" && form.driveRoute.destination.name.ko.trim() === "" && "드라이브 도착지 한국어 이름",
    form.placeType === "drive" && form.driveRoute.destination.name.en.trim() === "" && "드라이브 도착지 영어 이름",
    form.placeType === "drive" && form.driveRoute.destination.address.ko.trim() === "" && "드라이브 도착지 한국어 주소",
    form.placeType === "drive" && form.driveRoute.destination.address.en.trim() === "" && "드라이브 도착지 영어 주소",
    form.placeType === "drive" && form.driveRoute.destination.latitude === "" && "드라이브 도착지 위도",
    form.placeType === "drive" && form.driveRoute.destination.longitude === "" && "드라이브 도착지 경도",
    form.placeType === "drive" && form.driveRoute.waypoints.some(waypoint => waypoint.latitude === "" || waypoint.longitude === "") && "모든 드라이브 경유지 좌표",
    form.placeType === "drive" && form.driveRoute.waypoints.filter(waypoint => waypoint.googleEnabled).length > 3 && "Google 지도용 경유지 최대 3개",
    form.placeType === "drive" && routePathFromText(form.driveRoute.routePathText).length < 2 && "경로 좌표 2개 이상",
  ].filter(Boolean);

  const publish = async () => {
    if (!selected?._id || status.saving || status.publishing || missingFields.length) return;
    if (!window.confirm("이 장소를 사이트에 공개할까요? 공개 후 지역 또는 테마 목록에 표시됩니다.")) return;
    setStatus(value => ({ ...value, publishing: true, error: "", saved: false }));
    try {
      const body = form.placeType === "drive"
        ? { ...form, driveRoute: driveRoutePayload(form.driveRoute) }
        : form;
      await memberApi(`/operator/external-places/${selected._id}`, { method: "PATCH", body });
      const result = await memberApi(`/operator/external-places/${selected._id}/publish`, { method: "POST" });
      setDrafts(items => items.filter(item => item._id !== selected._id));
      setSelected(null);
      setForm(toForm());
      setStatus(value => ({ ...value, publishing: false, saved: false, error: "", publishedId: result.id }));
    } catch (error) {
      setStatus(value => ({ ...value, publishing: false, error: error.message, saved: false }));
    }
  };

  const removePlace = async () => {
    if (!selected?._id || status.saving || status.publishing || status.deleting) return;
    const confirmed = window.confirm(`“${selected.name}” 장소를 DB에서 완전히 삭제할까요?\n삭제 후에는 사이트에서도 바로 사라지며 복구할 수 없습니다.`);
    if (!confirmed) return;
    setStatus(value => ({ ...value, deleting: true, error: "", saved: false, deletedName: null }));
    try {
      await memberApi(`/operator/external-places/${selected._id}`, { method: "DELETE" });
      const deletedName = selected.name;
      setDrafts(items => items.filter(item => item._id !== selected._id));
      setSelected(null);
      setForm(toForm());
      setStatus(value => ({ ...value, deleting: false, error: "", deletedName, publishedId: null }));
    } catch (error) {
      setStatus(value => ({ ...value, deleting: false, error: error.message }));
    }
  };

  return (
    <section className="tourDraftManager">
      <div className="tourApiSectionHeading"><span>{source === "manual" ? "DIRECT" : "STEP 3"}</span><div><h2>장소 정보 관리</h2><p>{source === "tourApi" ? "한국어와 대응되는 영문 TourAPI 자료가 있으면 자동 입력되며, 없는 항목만 직접 작성합니다." : "장소 정보를 모두 직접 입력해 초안으로 저장하고 사이트에 공개합니다."}</p></div></div>
      {source === "manual" && <button className="tourDraftCreate" type="button" onClick={createManualDraft} disabled={status.saving}>{status.saving ? "만드는 중" : "+ 새 장소 입력"}</button>}
      {status.publishedId && <p className="tourApiSuccess">장소를 공개했습니다. 공개 ID: {status.publishedId}</p>}
      {status.deletedName && <p className="tourApiSuccess">“{status.deletedName}” 장소를 DB에서 삭제했습니다.</p>}
      {status.loading ? <p className="tourApiEmpty">초안을 불러오고 있습니다.</p> : status.error && !selected ? <p className="tourApiError">{status.error}</p> : (
        <div className="tourDraftLayout">
          <div className="tourDraftList">
            {!drafts.length && <p className="tourApiEmpty">저장된 장소가 없습니다.</p>}
            {drafts.map(draft => <button type="button" key={draft._id} className={selected?._id === draft._id ? "selected" : ""} onClick={() => chooseDraft(draft)}>
              {draft.selectedImage?.thumbnailUrl
                ? <img src={draft.selectedImage.thumbnailUrl} alt="" />
                : <span className="tourDraftNoImage">사진<br />준비 중</span>}
              <span><strong>{draft.name}</strong><small>{regionOptions.find(region => region.code === draft.regionCode)?.ko || draft.address}</small><small><em className={`tourDraftBadge ${draft.status}`}>{draft.status === "published" ? "공개" : "초안"}</em> {draft.source === "manual" ? "직접 입력" : `TourAPI ID ${draft.externalId}`}</small></span>
            </button>)}
          </div>
          {!selected ? <p className="tourApiEmpty">편집할 초안을 선택하세요.</p> : <form className="tourDraftForm" onSubmit={save}>
            <div className="tourDraftPreview">
              {selected.selectedImage?.thumbnailUrl
                ? <img src={selected.selectedImage.thumbnailUrl} alt={selected.name} />
                : <div className="tourDraftPreviewEmpty"><img src="/images/emptyImage.jpg" alt="" /><strong>등록된 사진이 없어 대체 이미지를 사용합니다.</strong></div>}
              {selected.selectedImage?.provider && <span>사진 제공: {selected.selectedImage.provider}</span>}
            </div>
            <div className="tourDraftTwo"><label>장소 유형<select name="placeType" value={form.placeType} onChange={update}><option value="attraction">관광지</option><option value="cafe">카페</option><option value="restaurant">음식점</option><option value="lodging">숙박</option><option value="food">지역 음식</option><option value="market">시장</option><option value="park">공원</option><option value="ocean">해수욕장</option><option value="drive">드라이브</option></select></label><label>지역 코드<select name="regionCode" value={form.regionCode} onChange={update}>{regionOptions.map(region => <option key={region.code} value={region.code}>{region.ko} / {region.en}</option>)}</select></label></div>
            <div className="tourDraftTwo"><label>한국어 이름<input required maxLength={200} name="name" value={form.name} onChange={update} /></label><label>영어 이름<input maxLength={200} name="nameEn" value={form.nameEn} onChange={update} /></label></div>
            <div className="tourDraftTwo"><label>한국어 주소<input maxLength={500} name="address" value={form.address} onChange={update} /></label><label>영어 주소<input maxLength={500} name="addressEn" value={form.addressEn} onChange={update} /></label></div>
            {form.placeType !== "drive" && <div className="tourDraftTwo"><label>위도<input type="number" step="any" name="latitude" value={form.latitude} onChange={update} placeholder="예: 37.5796" /></label><label>경도<input type="number" step="any" name="longitude" value={form.longitude} onChange={update} placeholder="예: 126.9770" /></label></div>}
            {form.placeType === "drive" && <fieldset className="tourDraftDriveFields">
              <legend>드라이브 경로 <small>OpenStreetMap 경로 데이터</small></legend>
              <div className="tourDraftDrivePoint">
                <div className="tourDraftDrivePointHeading"><strong>출발지</strong></div>
                <div className="tourDraftTwo"><label>한국어 이름<input value={form.driveRoute.start.name.ko} onChange={event => updateRoutePoint("start", "name", event.target.value, "ko")} /></label><label>영어 이름<input value={form.driveRoute.start.name.en} onChange={event => updateRoutePoint("start", "name", event.target.value, "en")} /></label></div>
                <div className="tourDraftTwo"><label>한국어 주소<input value={form.driveRoute.start.address.ko} onChange={event => updateRoutePoint("start", "address", event.target.value, "ko")} /></label><label>영어 주소<input value={form.driveRoute.start.address.en} onChange={event => updateRoutePoint("start", "address", event.target.value, "en")} /></label></div>
                <div className="tourDraftTwo"><label>위도<input type="number" step="any" value={form.driveRoute.start.latitude} onChange={event => updateRoutePoint("start", "latitude", event.target.value)} /></label><label>경도<input type="number" step="any" value={form.driveRoute.start.longitude} onChange={event => updateRoutePoint("start", "longitude", event.target.value)} /></label></div>
              </div>

              <div className="tourDraftDriveWaypointHeading"><strong>중요 경유지</strong><button type="button" onClick={addWaypoint} disabled={form.driveRoute.waypoints.length >= 5}>+ 경유지 추가</button></div>
              {form.driveRoute.waypoints.length === 0 && <p className="tourDraftHint">경유지는 선택 사항이며 최대 5개까지 추가할 수 있습니다.</p>}
              {form.driveRoute.waypoints.map((waypoint, index) => <div className="tourDraftDrivePoint" key={`waypoint-${index}`}>
                <div className="tourDraftDrivePointHeading"><strong>경유지 {index + 1}</strong><button type="button" onClick={() => removeWaypoint(index)}>삭제</button></div>
                <div className="tourDraftTwo"><label>한국어 이름 <small>선택</small><input value={waypoint.name.ko} onChange={event => updateWaypoint(index, "name", event.target.value, "ko")} /></label><label>영어 이름 <small>선택</small><input value={waypoint.name.en} onChange={event => updateWaypoint(index, "name", event.target.value, "en")} /></label></div>
                <div className="tourDraftTwo"><label>위도<input type="number" step="any" value={waypoint.latitude} onChange={event => updateWaypoint(index, "latitude", event.target.value)} /></label><label>경도<input type="number" step="any" value={waypoint.longitude} onChange={event => updateWaypoint(index, "longitude", event.target.value)} /></label></div>
                <label className="tourDraftDriveGoogle"><input type="checkbox" checked={waypoint.googleEnabled} onChange={event => updateWaypoint(index, "googleEnabled", event.target.checked)} disabled={!waypoint.googleEnabled && form.driveRoute.waypoints.filter(item => item.googleEnabled).length >= 3} /> Google 지도 경유지로 사용 <small>최대 3개</small></label>
              </div>)}

              <div className="tourDraftDrivePoint">
                <div className="tourDraftDrivePointHeading"><strong>도착지</strong></div>
                <div className="tourDraftTwo"><label>한국어 이름<input value={form.driveRoute.destination.name.ko} onChange={event => updateRoutePoint("destination", "name", event.target.value, "ko")} /></label><label>영어 이름<input value={form.driveRoute.destination.name.en} onChange={event => updateRoutePoint("destination", "name", event.target.value, "en")} /></label></div>
                <div className="tourDraftTwo"><label>한국어 주소<input value={form.driveRoute.destination.address.ko} onChange={event => updateRoutePoint("destination", "address", event.target.value, "ko")} /></label><label>영어 주소<input value={form.driveRoute.destination.address.en} onChange={event => updateRoutePoint("destination", "address", event.target.value, "en")} /></label></div>
                <div className="tourDraftTwo"><label>위도<input type="number" step="any" value={form.driveRoute.destination.latitude} onChange={event => updateRoutePoint("destination", "latitude", event.target.value)} /></label><label>경도<input type="number" step="any" value={form.driveRoute.destination.longitude} onChange={event => updateRoutePoint("destination", "longitude", event.target.value)} /></label></div>
              </div>

              <div className="tourDraftGeoJsonImport">
                <div><strong>GeoJSON 자동 가져오기</strong><small>구간 파일을 진행 순서대로 여러 개 선택하세요.</small></div>
                <label className="tourDraftGeoJsonButton">
                  {geoJsonImport.loading ? "파일 읽는 중" : "GeoJSON 파일 선택"}
                  <input type="file" accept=".geojson,.json,application/geo+json,application/json" multiple onChange={importGeoJson} disabled={geoJsonImport.loading} />
                </label>
                {geoJsonImport.files.length > 0 && <p>선택 파일: {geoJsonImport.files.join(" → ")}</p>}
                {geoJsonImport.error && <p className="tourApiError">{geoJsonImport.error}</p>}
                {!geoJsonImport.error && geoJsonImport.points > 0 && <p className="tourApiSuccess">{geoJsonImport.files.length}개 파일을 병합해 경로 좌표 {geoJsonImport.points.toLocaleString()}개와 경유지 {geoJsonImport.waypoints}개를 입력했습니다. 출발·도착 좌표도 자동 적용했습니다.</p>}
              </div>
              <label className="tourDraftRoutePath">경로 좌표 <small>GeoJSON을 가져오면 자동 입력됩니다. 필요한 경우 직접 수정할 수 있습니다.</small><textarea rows={10} value={form.driveRoute.routePathText} onChange={updateRoutePath} placeholder={"37.123456,127.123456\n37.124567,127.124567"} /></label>
              <p className="tourDraftHint">현재 입력된 경로 좌표: {routePathFromText(form.driveRoute.routePathText).length.toLocaleString()}개</p>
            </fieldset>}
            <fieldset className="tourDraftLinkFields"><legend>공식 채널 링크 <small>선택 입력</small></legend><div className="tourDraftTwo"><label>공식 홈페이지<input type="url" maxLength={1000} name="homepage" value={form.homepage} onChange={update} placeholder="https://www.example.com" /></label><label>인스타그램<input type="url" maxLength={1000} name="instagram" value={form.instagram} onChange={update} placeholder="https://www.instagram.com/account" /></label></div></fieldset>
            <div className="tourDraftTwo"><label>한국어 짧은 소개<textarea maxLength={500} rows={4} name="shortDescription" value={form.shortDescription} onChange={update} placeholder="TourAPI 개요에서 자동 생성됩니다." /></label><label>영어 짧은 소개<textarea maxLength={500} rows={4} name="shortDescriptionEn" value={form.shortDescriptionEn} onChange={update} placeholder="영문 자료가 없으면 직접 번역해 입력하세요." /></label></div>
            <div className="tourDraftTwo"><label>한국어 상세 설명<textarea maxLength={5000} rows={9} name="description" value={form.description} onChange={update} placeholder="TourAPI 개요가 자동 입력됩니다." /></label><label>영어 상세 설명<textarea maxLength={5000} rows={9} name="descriptionEn" value={form.descriptionEn} onChange={update} placeholder="영문 자료가 없으면 직접 번역해 입력하세요." /></label></div>
            {status.error && <p className="tourApiError">{status.error}</p>}{status.saved && <p className="tourApiSuccess">{selected.status === "published" ? "공개 장소 정보를 수정했습니다." : "초안 정보를 저장했습니다."}</p>}
            {missingFields.length > 0 && <p className="tourDraftHint">공개 전 입력 필요: {missingFields.join(", ")}</p>}
            <div className="tourDraftActions">
              <button className="tourDraftSave" type="submit" disabled={status.saving || status.publishing || status.deleting}>{status.saving ? "저장 중" : selected.status === "published" ? "공개 정보 수정" : "초안 정보 저장"}</button>
              {selected.status === "draft" && <button className="tourDraftPublish" type="button" onClick={publish} disabled={status.saving || status.publishing || status.deleting || missingFields.length > 0}>{status.publishing ? "공개 중" : "사이트에 공개"}</button>}
              <button className="tourDraftDelete" type="button" onClick={removePlace} disabled={status.saving || status.publishing || status.deleting}>{status.deleting ? "삭제 중" : "이 장소 삭제"}</button>
            </div>
          </form>}
        </div>
      )}
    </section>
  );
};

export default TourApiDraftManager;
