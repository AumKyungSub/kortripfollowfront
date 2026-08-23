import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomOverlayMap, Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { ApiError, memberApi, placePath } from "@/shared/api/memberApi";
import { useLanguage } from "@/shared/hooks/useLanguage";
import "./CourseDetailPage.style.css";

const text = {
  ko: {
    back: "저장한 코스로", info: "코스 정보", schedule: "시간표", checklist: "체크리스트", editors: "함께 편집", registeredMembers: "등록된 멤버",
    description: "설명", period: "여행 기간", places: "코스에 담긴 장소", map: "코스 지도", edit: "수정", save: "저장", cancel: "취소",
    start: "여행 시작일", end: "여행 종료일", title: "코스 이름", visibility: "공개 범위", private: "비공개", unlisted: "링크 공개", public: "전체 공개",
    noDescription: "등록된 설명이 없습니다.", noPlaces: "코스에 담긴 장소가 없습니다.", noMap: "지도에 표시할 장소가 없습니다.", placeSearch: "장소명·지역·주소 검색", addPlace: "추가", removePlace: "빼기", moveUp: "올리기", moveDown: "내리기", noPlaceResult: "검색된 장소가 없습니다.",
    scheduleHint: "날짜별 이동과 활동 시간을 계획해 보세요.", addPlan: "일정 추가", date: "날짜", time: "시간", plan: "계획", memo: "메모 (선택)", emptySchedule: "아직 등록된 시간 계획이 없습니다.",
    checklistHint: "여행 전에 챙겨야 할 준비물을 함께 확인하세요.", checklistPlaceholder: "예: 여권, 충전기", add: "추가", emptyChecklist: "이 영역의 체크리스트가 비어 있습니다.", remove: "삭제", common: "공통", author: "작성자", registeredMember: "등록 멤버", personalChecklistHint: "개인 영역은 해당 멤버만 추가·체크·삭제할 수 있습니다.",
    editorHint: "함께 계획할 비밀번호를 설정하거나 변경하고 편집 권한이 있는 멤버를 관리할 수 있습니다.", passwordPlaceholder: "4~32자 비밀번호", setPassword: "비밀번호 저장", joinHint: "작성자가 공유한 비밀번호를 입력해 편집 권한을 등록하세요.", registeredHint: "편집 권한이 등록되어 있습니다.", join: "편집 참여", noEditors: "편집 권한이 등록된 멤버가 없습니다.", passwordUsage: "해당 비밀번호를 아는 사람들과 함께 계획 수정이 가능합니다.", wrongPassword: "비밀번호가 올바르지 않습니다.", joined: "편집 권한이 등록되었습니다.", revoke: "권한 해제",
    viewOnly: "이 코스는 보기만 가능합니다. 비밀번호를 인증한 회원만 수정할 수 있습니다.", loginRequired: "로그인 후 비밀번호를 인증하면 함께 수정할 수 있습니다.", loadError: "코스를 불러오지 못했습니다.", saveError: "저장하지 못했습니다.", notFound: "코스를 찾을 수 없거나 볼 권한이 없습니다.",
  },
  en: {
    back: "Back to itineraries", info: "Overview", schedule: "Schedule", checklist: "Checklist", editors: "Collaborators", registeredMembers: "Registered members",
    description: "Description", period: "Travel dates", places: "Places", map: "Course map", edit: "Edit", save: "Save", cancel: "Cancel",
    start: "Start date", end: "End date", title: "Title", visibility: "Visibility", private: "Private", unlisted: "Link only", public: "Public",
    noDescription: "No description provided.", noPlaces: "No places in this itinerary.", noMap: "No locations to show.", placeSearch: "Search by place, region, or address", addPlace: "Add", removePlace: "Remove", moveUp: "Move up", moveDown: "Move down", noPlaceResult: "No places found.",
    scheduleHint: "Plan activities for each day.", addPlan: "Add plan", date: "Date", time: "Time", plan: "Plan", memo: "Memo (optional)", emptySchedule: "No schedule yet.",
    checklistHint: "Keep track of everything you need before your trip.", checklistPlaceholder: "e.g. passport, charger", add: "Add", emptyChecklist: "This checklist is empty.", remove: "Remove", common: "Shared", author: "Author", registeredMember: "Member", personalChecklistHint: "Only this member can add, check, or delete items in their personal area.",
    editorHint: "Set the shared password and manage members with editing access.", passwordPlaceholder: "4–32 characters", setPassword: "Save password", joinHint: "Enter the password shared by the owner to get editing access.", registeredHint: "Editing access is already registered.", join: "Join editing", noEditors: "No members have editing access yet.", passwordUsage: "People who know this password can edit the plan with you.", wrongPassword: "The password is incorrect.", joined: "Editing access granted.", revoke: "Revoke access",
    viewOnly: "This itinerary is view-only. Signed-in members who verify the password can edit.", loginRequired: "Sign in and verify the password to edit.", loadError: "Could not load the itinerary.", saveError: "Could not save changes.", notFound: "This itinerary is unavailable.",
  }
};

const dateValue = value => value ? String(value).slice(0, 10) : "";
const placeName = (place, lang) => place?.place?.location?.name?.[lang] || place?.place?.location?.name?.ko || place?.location?.name?.[lang] || place?.location?.name?.ko || "";

function CourseMap({ places, lang, labels }) {
  useKakaoLoader();
  const markers = places.flatMap(place => {
    const pair = place?.place?.location?.latLng?.split(",").map(Number);
    return pair?.length === 2 && pair.every(Number.isFinite) ? [{ place, lat: pair[0], lng: pair[1] }] : [];
  });
  if (!markers.length) return <div className="courseDetailEmpty">{labels.noMap}</div>;
  const center = { lat: markers.reduce((sum, item) => sum + item.lat, 0) / markers.length, lng: markers.reduce((sum, item) => sum + item.lng, 0) / markers.length };
  return <Map className="courseDetailMap" center={center} level={markers.length > 1 ? 11 : 4}>
    {markers.map(({ place, lat, lng }, index) => <Fragment key={`${place.placeType}:${place.placeId}`}>
      <MapMarker position={{ lat, lng }} />
      <CustomOverlayMap position={{ lat, lng }} yAnchor={2.3}><span className="courseMapLabel">{index + 1}. {placeName(place, lang)}</span></CustomOverlayMap>
    </Fragment>)}
  </Map>;
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
  const [infoForm, setInfoForm] = useState({ title: "", description: "", visibility: "private", start: "", end: "" });
  const [planForm, setPlanForm] = useState({ date: "", time: "", title: "", memo: "" });
  const [checkText, setCheckText] = useState("");
  const [checklistCategory, setChecklistCategory] = useState("common");
  const [editPassword, setEditPassword] = useState("");
  const [accessMessage, setAccessMessage] = useState("");
  const [draftDays, setDraftDays] = useState([]);
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeResults, setPlaceResults] = useState([]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [auth, data] = await Promise.all([memberApi("/auth/session"), memberApi(`/itineraries/${id}`)]);
      setSession(auth); setCourse(data);
    } catch (requestError) {
      setError(requestError instanceof ApiError && requestError.status === 404 ? labels.notFound : labels.loadError);
    } finally { setLoading(false); }
  }, [id, labels.loadError, labels.notFound]);
  useEffect(() => { load(); }, [load]);

  const places = useMemo(() => (course?.days || []).flatMap(day => day.places || []).sort((a, b) => a.order - b.order), [course]);
  const dates = useMemo(() => (course?.days || []).map(day => dateValue(day.date)).filter(Boolean).sort(), [course]);
  const cover = places.find(place => place.place?.img?.link);
  const beginInfoEdit = () => {
    setInfoForm({ title: course.title, description: course.description || "", visibility: course.visibility, start: dates[0] || "", end: dates.at(-1) || "" });
    setDraftDays(structuredClone(course.days || []));
    setPlaceSearch("");
    setPlaceResults([]);
    setEditingInfo(true);
  };
  useEffect(() => {
    if (!editingInfo || !placeSearch.trim()) { setPlaceResults([]); return; }
    let activeRequest = true;
    const timer = window.setTimeout(async () => {
      try {
        const results = await memberApi(`/places/search?q=${encodeURIComponent(placeSearch.trim())}`);
        if (activeRequest) setPlaceResults(results.slice(0, 8));
      } catch { if (activeRequest) setPlaceResults([]); }
    }, 250);
    return () => { activeRequest = false; window.clearTimeout(timer); };
  }, [editingInfo, placeSearch]);
  const patchCourse = async body => {
    setError("");
    try { const updated = await memberApi(`/itineraries/${id}`, { method: "PATCH", body }); setCourse(previous => ({ ...previous, ...updated, isOwner: previous.isOwner, canEdit: previous.canEdit })); return true; }
    catch { setError(labels.saveError); return false; }
  };
  const saveInfo = async event => {
    event.preventDefault();
    const days = structuredClone(draftDays);
    if (!days.length) days.push({ date: infoForm.start || null, title: "", places: [] });
    else days[0] = { ...days[0], date: infoForm.start || null };
    if (infoForm.end && infoForm.end !== infoForm.start) {
      if (days.length === 1) days.push({ date: infoForm.end, title: "", places: [] });
      else days[days.length - 1] = { ...days.at(-1), date: infoForm.end };
    }
    const body = { title: infoForm.title, description: infoForm.description, days };
    if (course.isOwner) body.visibility = infoForm.visibility;
    if (await patchCourse(body)) setEditingInfo(false);
  };
  const addDraftPlace = result => {
    const key = `${result.placeType}:${result.placeId}`;
    if (draftDays.flatMap(day => day.places || []).some(place => `${place.placeType}:${place.placeId}` === key)) return;
    const next = structuredClone(draftDays);
    if (!next.length) next.push({ date: infoForm.start || null, title: "", places: [] });
    next[0].places = [...(next[0].places || []), { placeType: result.placeType, placeId: result.placeId, order: next[0].places?.length || 0, memo: "", place: result }];
    setDraftDays(next);
  };
  const removeDraftPlace = target => setDraftDays(draftDays.map(day => ({ ...day, places: (day.places || []).filter(place => !(place.placeType === target.placeType && place.placeId === target.placeId)).map((place, order) => ({ ...place, order })) })));
  const moveDraftPlace = (index, direction) => {
    const ordered = draftDays.flatMap(day => day.places || []);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    const reordered = ordered.map((place, order) => ({ ...place, order }));
    const next = structuredClone(draftDays);
    if (!next.length) next.push({ date: infoForm.start || null, title: "", places: [] });
    next[0].places = reordered;
    for (let dayIndex = 1; dayIndex < next.length; dayIndex += 1) next[dayIndex].places = [];
    setDraftDays(next);
  };
  const addPlan = async event => {
    event.preventDefault(); if (!planForm.date || !planForm.time || !planForm.title.trim()) return;
    const schedule = structuredClone(course.schedule || []);
    let day = schedule.find(item => dateValue(item.date) === planForm.date);
    if (!day) { day = { date: planForm.date, items: [] }; schedule.push(day); }
    day.items.push({ time: planForm.time, title: planForm.title.trim(), memo: planForm.memo.trim() });
    day.items.sort((a, b) => a.time.localeCompare(b.time)); schedule.sort((a, b) => dateValue(a.date).localeCompare(dateValue(b.date)));
    if (await patchCourse({ schedule })) setPlanForm({ date: planForm.date, time: "", title: "", memo: "" });
  };
  const removePlan = async (dayIndex, itemIndex) => {
    const schedule = structuredClone(course.schedule || []); schedule[dayIndex].items.splice(itemIndex, 1);
    await patchCourse({ schedule: schedule.filter(day => day.items.length) });
  };
  const updateChecklistCourse = updated => setCourse(previous => ({ ...previous, ...updated, isOwner: previous.isOwner, canEdit: previous.canEdit }));
  const addChecklist = async event => {
    event.preventDefault(); if (!checkText.trim()) return;
    try {
      const updated = await memberApi(`/itineraries/${id}/checklist`, { method: "POST", body: { text: checkText.trim(), scope: checklistCategory === "common" ? "common" : "personal" } });
      updateChecklistCourse(updated); setCheckText("");
    } catch { setError(labels.saveError); }
  };
  const toggleChecklist = async item => {
    try { updateChecklistCourse(await memberApi(`/itineraries/${id}/checklist/${item._id}`, { method: "PATCH", body: { checked: !item.checked } })); }
    catch { setError(labels.saveError); }
  };
  const deleteChecklist = async item => {
    try { updateChecklistCourse(await memberApi(`/itineraries/${id}/checklist/${item._id}`, { method: "DELETE" })); }
    catch { setError(labels.saveError); }
  };
  const saveEditPassword = async event => {
    event.preventDefault(); setError(""); setAccessMessage("");
    try { await memberApi(`/itineraries/${id}/edit-password`, { method: "PUT", body: { password: editPassword } }); setCourse(previous => ({ ...previous, hasEditPassword: true })); setEditPassword(""); setAccessMessage(labels.save); }
    catch { setError(labels.saveError); }
  };
  const joinEditing = async event => {
    event.preventDefault(); setError(""); setAccessMessage("");
    try { const updated = await memberApi(`/itineraries/${id}/edit-access`, { method: "POST", body: { password: editPassword } }); setCourse(previous => ({ ...previous, ...updated, canEdit: true })); setEditPassword(""); setAccessMessage(labels.joined); }
    catch (requestError) { setError(requestError.status === 403 ? labels.wrongPassword : labels.saveError); }
  };
  const removeEditor = async userId => { const updated = await memberApi(`/itineraries/${id}/editors/${userId}`, { method: "DELETE" }); setCourse(previous => ({ ...previous, editors: updated.editors })); };

  if (loading) return <><Header /><main className="courseDetailStatus">Loading...</main><Footer /></>;
  if (!course) return <><Header /><main className="courseDetailStatus"><p>{error}</p><button onClick={() => navigate(-1)}>{labels.back}</button></main><Footer /></>;
  const collaboratorLabel = course.isOwner ? labels.registeredMembers : labels.editors;
  const nav = [["info", labels.info], ["schedule", labels.schedule], ["checklist", labels.checklist], ["editors", collaboratorLabel]];
  const currentUserId = String(session?.user?.id || "");
  const checklistCategories = [
    { id: "common", label: labels.common },
    ...(course.owner ? [{ id: String(course.owner._id), label: labels.author }] : []),
    ...(course.editors || []).map((editor, index) => ({ id: String(editor._id), label: editor.displayName || `${labels.registeredMember} ${index + 1}` }))
  ];
  const visibleChecklist = (course.checklist || []).filter(item => checklistCategory === "common" ? !item.ownerId : String(item.ownerId) === checklistCategory);
  const canManageChecklist = Boolean(course.canEdit && (checklistCategory === "common" || checklistCategory === currentUserId));
  return <><Header /><main className="courseDetailPage">
    <div className="courseDetailTop"><Link to="/myTravel">← {labels.back}</Link>{!course.canEdit && <span>{session?.authenticated ? labels.viewOnly : labels.loginRequired}</span>}</div>
    <section className="courseHero">
      {cover ? <img src={`${cover.place.img.link}3R.jpg`} alt="" /> : <div className="courseHeroFallback" />}
      <div className="courseHeroShade" /><div className="courseHeroCopy"><span className={`courseVisibility ${course.visibility}`}>{labels[course.visibility]}</span><h1>{course.title}</h1><p>{dates.length ? `${dates[0]} ~ ${dates.at(-1)}` : labels.period}</p></div>
    </section>
    <div className="courseDashboard">
      <aside className="courseSideNav" aria-label="Course detail sections">{nav.map(([key, label]) => <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>{label}</button>)}</aside>
      <nav className="courseMobileNav" aria-label="Course detail sections">{nav.map(([key, label]) => <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>{label}</button>)}</nav>
      <div className="coursePanel">
        {error && <p className="courseError">{error}</p>}
        {active === "info" && <section>
          <div className="courseSectionHeading"><div><span>OVERVIEW</span><h2>{labels.info}</h2></div>{course.canEdit && !editingInfo && <button className="primaryButton" onClick={beginInfoEdit}>{labels.edit}</button>}</div>
          {editingInfo ? <form className="courseInfoForm" onSubmit={saveInfo}>
            <label>{labels.title}<input value={infoForm.title} maxLength="100" required onChange={e => setInfoForm({ ...infoForm, title: e.target.value })} /></label>
            {course.isOwner ? <label>{labels.visibility}<select value={infoForm.visibility} onChange={e => setInfoForm({ ...infoForm, visibility: e.target.value })}><option value="private">{labels.private}</option><option value="unlisted">{labels.unlisted}</option><option value="public">{labels.public}</option></select></label> : <label>{labels.visibility}<input value={labels[course.visibility]} disabled /></label>}
            <label className="wide">{labels.description}<textarea value={infoForm.description} maxLength="2000" onChange={e => setInfoForm({ ...infoForm, description: e.target.value })} /></label>
            <label>{labels.start}<input type="date" value={infoForm.start} onChange={e => setInfoForm({ ...infoForm, start: e.target.value })} /></label><label>{labels.end}<input type="date" min={infoForm.start} value={infoForm.end} onChange={e => setInfoForm({ ...infoForm, end: e.target.value })} /></label>
            <div className="coursePlaceEditor wide"><h3>{labels.places}</h3><div className="placeSearchBox"><input value={placeSearch} placeholder={labels.placeSearch} onChange={e => setPlaceSearch(e.target.value)} /></div>{placeSearch.trim() && <ul className="placeSearchResults">{placeResults.length ? placeResults.map(result => <li key={`${result.placeType}:${result.placeId}`}><span>{placeName(result, lang)}</span><button type="button" onClick={() => addDraftPlace(result)}>{labels.addPlace}</button></li>) : <li className="noResult">{labels.noPlaceResult}</li>}</ul>}<ol className="draftPlaceList">{draftDays.flatMap(day => day.places || []).map((place, index, orderedPlaces) => <li key={`${place.placeType}:${place.placeId}`}><span>{index + 1}. {placeName(place, lang)}</span><div className="placeOrderButtons"><button type="button" disabled={index === 0} onClick={() => moveDraftPlace(index, -1)}>↑ {labels.moveUp}</button><button type="button" disabled={index === orderedPlaces.length - 1} onClick={() => moveDraftPlace(index, 1)}>↓ {labels.moveDown}</button><button type="button" className="removePlaceButton" onClick={() => removeDraftPlace(place)}>{labels.removePlace}</button></div></li>)}</ol></div>
            <div className="formButtons wide"><button type="button" onClick={() => setEditingInfo(false)}>{labels.cancel}</button><button className="primaryButton">{labels.save}</button></div>
          </form> : <div className="courseOverview"><article><h3>{labels.description}</h3><p>{course.description || labels.noDescription}</p></article><article><h3>{labels.period}</h3><p>{dates.length ? `${dates[0]} ~ ${dates.at(-1)}` : "-"}</p></article></div>}
          <h3 className="subheading">{labels.places}</h3>{places.length ? <ol className="coursePlaceList">{places.map((place, index) => <li key={`${place.placeType}:${place.placeId}`}><span>{index + 1}</span><Link to={placePath(place.placeType, place.placeId)}>{placeName(place, lang)}</Link></li>)}</ol> : <div className="courseDetailEmpty">{labels.noPlaces}</div>}
          <h3 className="subheading">{labels.map}</h3><CourseMap places={places} lang={lang} labels={labels} />
        </section>}
        {active === "schedule" && <section><div className="courseSectionHeading"><div><span>DAILY PLAN</span><h2>{labels.schedule}</h2><p>{labels.scheduleHint}</p></div></div>
          {course.canEdit && <form className="planForm" onSubmit={addPlan}><input aria-label={labels.date} type="date" min={dates[0]} max={dates.at(-1)} value={planForm.date} required onChange={e => setPlanForm({ ...planForm, date: e.target.value })} /><input aria-label={labels.time} type="time" value={planForm.time} required onChange={e => setPlanForm({ ...planForm, time: e.target.value })} /><input aria-label={labels.plan} placeholder={labels.plan} value={planForm.title} required onChange={e => setPlanForm({ ...planForm, title: e.target.value })} /><input aria-label={labels.memo} placeholder={labels.memo} value={planForm.memo} onChange={e => setPlanForm({ ...planForm, memo: e.target.value })} /><button className="primaryButton">+ {labels.addPlan}</button></form>}
          {(course.schedule || []).length ? <div className="scheduleDays">{course.schedule.map((day, dayIndex) => <article key={day._id || day.date}><h3>{dateValue(day.date)}</h3>{day.items.map((item, itemIndex) => <div className="scheduleRow" key={item._id || `${item.time}-${itemIndex}`}><time>{item.time}</time><div><strong>{item.title}</strong>{item.memo && <p>{item.memo}</p>}</div>{course.canEdit && <button onClick={() => removePlan(dayIndex, itemIndex)} aria-label={labels.remove}>×</button>}</div>)}</article>)}</div> : <div className="courseDetailEmpty">{labels.emptySchedule}</div>}
        </section>}
        {active === "checklist" && <section><div className="courseSectionHeading"><div><span>PACKING</span><h2>{labels.checklist}</h2><p>{labels.checklistHint}</p></div></div>
          <nav className="checklistCategories" aria-label={labels.checklist}>{checklistCategories.map(category => <button key={category.id} className={checklistCategory === category.id ? "active" : ""} onClick={() => { setChecklistCategory(category.id); setCheckText(""); }}>{category.label}</button>)}</nav>
          {checklistCategory !== "common" && <p className="personalChecklistHint">{labels.personalChecklistHint}</p>}
          {canManageChecklist && <form className="checkForm" onSubmit={addChecklist}><input value={checkText} placeholder={labels.checklistPlaceholder} onChange={e => setCheckText(e.target.value)} /><button className="primaryButton">{labels.add}</button></form>}
          {visibleChecklist.length ? <ul className="checkList">{visibleChecklist.map(item => <li key={item._id} className={item.checked ? "checked" : ""}><label><input type="checkbox" checked={item.checked} disabled={!canManageChecklist} onChange={() => toggleChecklist(item)} /><span>{item.text}</span></label>{canManageChecklist && <button onClick={() => deleteChecklist(item)}>{labels.remove}</button>}</li>)}</ul> : <div className="courseDetailEmpty">{labels.emptyChecklist}</div>}
        </section>}
        {active === "editors" && <section><div className="courseSectionHeading"><div><span>COLLABORATION</span><h2>{collaboratorLabel}</h2><p>{course.isOwner ? labels.editorHint : course.canEdit ? labels.registeredHint : labels.joinHint}</p></div></div>
          {(course.isOwner || (session?.authenticated && !course.canEdit)) && <><form className="checkForm" onSubmit={course.isOwner ? saveEditPassword : joinEditing}><input type="password" minLength="4" maxLength="32" autoComplete="new-password" required value={editPassword} placeholder={labels.passwordPlaceholder} onChange={e => setEditPassword(e.target.value)} /><button className="primaryButton">{course.isOwner ? labels.setPassword : labels.join}</button></form><p className="passwordUsage">{labels.passwordUsage}</p></>}
          {accessMessage && <p className="accessMessage">{accessMessage}</p>}
          {course.isOwner && course.editors?.length ? <ul className="editorList">{course.editors.map(editor => <li key={editor._id}><span className="editorAvatar">{editor.displayName?.[0] || "K"}</span><div><strong>{editor.displayName || "KORTRIP Member"}</strong></div><button onClick={() => removeEditor(editor._id)}>{labels.revoke}</button></li>)}</ul> : course.isOwner ? <div className="courseDetailEmpty">{labels.noEditors}</div> : null}
        </section>}
      </div>
    </div>
  </main><Footer /></>;
}
