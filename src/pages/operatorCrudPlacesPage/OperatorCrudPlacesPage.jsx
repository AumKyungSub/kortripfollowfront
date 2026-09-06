import { useEffect, useState } from "react";
import Header from "@/widgets/header/Header";
import Footer from "@/widgets/footer/Footer";
import { memberApi } from "@/shared/api/memberApi";
import CafeForm, { cafePayload, cafeSearchText, cafeToForm, newCafeForm } from "./CafeForm";
import RankingForm, { newRankingForm, rankingPayload, rankingSearchText, rankingToForm } from "./RankingForm";
import "./OperatorCrudPlacesPage.css";

const categories = ["blogs", "cafes", "collections", "drives", "foods", "lodgings", "markets", "oceans", "parks", "rankings", "restaurants"];
const enabled = new Set(["blogs", "cafes", "rankings"]);
const base = "/operator/crud-places";
const newBlog = () => ({ visibility: true, typeTable: "rankings", otherID: "", stars: "", date: { ko: "", en: "" } });
const blogForm = (item) => ({ visibility: item.visibility !== false, typeTable: item.typeTable, otherID: String(item.otherID), stars: String(item.stars ?? ""), date: { ko: item.date?.ko || "", en: item.date?.en || "" } });

export default function OperatorCrudPlacesPage() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let active = true;
    memberApi("/auth/session").then((value) => { if (active) setSession(value); }).catch(() => { if (active) setSession({ authenticated: false }); });
    return () => { active = false; };
  }, []);
  return <><Header /><main className="crudPlacesPage">
    <div className="crudHeading"><small>OPERATOR TOOL</small><h1>장소 데이터 관리</h1><p>카테고리별 저장 정보를 조회하고 편집합니다.</p></div>
    {!session ? <p role="status">운영자 권한을 확인하고 있습니다.</p> : !session.authenticated ? <p>로그인 후 사용할 수 있습니다.</p> : !session.user?.isOperator ? <p>운영자 전용 페이지입니다.</p> : <Workspace />}
  </main><Footer /></>;
}

function Workspace() {
  const [category, setCategory] = useState("blogs");
  const [records, setRecords] = useState({ blogs: [], cafes: [], rankings: [] });
  const [references, setReferences] = useState({});
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [savedForm, setSavedForm] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  const dirty = form !== null && JSON.stringify(form) !== savedForm;
  const items = records[category] || [];

  useEffect(() => {
    let active = true;
    Promise.all([memberApi(`${base}/blogs`), memberApi(`${base}/cafes`), memberApi(`${base}/rankings`), memberApi(`${base}/references`)]).then(([blogs, cafes, rankings, refs]) => {
      if (!active) return;
      setRecords({ blogs: blogs.items, cafes: cafes.items, rankings: rankings.items });
      setReferences(refs); setReadOnly(blogs.readOnly || cafes.readOnly || rankings.readOnly); setReady(true);
    }).catch((reason) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const canLeave = () => !dirty || window.confirm("저장하지 않은 내용이 있습니다. 변경 내용을 버릴까요?");
  const placeFor = (item) => references[item.typeTable]?.find((place) => place.id === Number(item.otherID));
  const makeForm = (item) => category === "cafes"
    ? (item ? cafeToForm(item) : newCafeForm())
    : category === "rankings"
      ? (item ? rankingToForm(item) : newRankingForm())
      : (item ? blogForm(item) : newBlog());
  const open = (item) => {
    if (busy || !canLeave()) return;
    const next = makeForm(item);
    setSelected(item); setForm(next); setSavedForm(JSON.stringify(next)); setError(""); setNotice("");
  };
  const changeCategory = (next) => {
    if (next === category || busy || !canLeave()) return;
    setCategory(next); setKeyword(""); setSelected(null); setForm(null); setError(""); setNotice("");
  };
  const filtered = items.filter((item) => {
    const value = category === "cafes" ? cafeSearchText(item) : category === "rankings" ? rankingSearchText(item) : `${item.id} ${item.typeTable} ${placeFor(item)?.name || ""} ${placeFor(item)?.address || ""} ${item.otherID}`;
    return value.toLowerCase().includes(keyword.trim().toLowerCase());
  });
  const updateCurrent = (saved) => setRecords((previous) => ({ ...previous, [category]: [saved, ...previous[category].filter((item) => item.id !== saved.id)].sort((a, b) => b.id - a.id) }));
  async function save(event) {
    event.preventDefault();
    if (busy || readOnly) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const body = category === "cafes" ? cafePayload(form) : category === "rankings" ? rankingPayload(form) : { ...form, otherID: Number(form.otherID) };
      const saved = await memberApi(`${base}/${category}${selected ? `/${selected.id}` : ""}`, { method: selected ? "PATCH" : "POST", body });
      updateCurrent(saved);
      if (["cafes", "rankings"].includes(category)) setReferences((previous) => ({ ...previous, [category]: [{ id: saved.id, name: saved.location?.name?.ko, address: (saved.location?.address?.ko || []).join(" ") }, ...(previous[category] || []).filter((item) => item.id !== saved.id)] }));
      const next = category === "cafes" ? cafeToForm(saved) : category === "rankings" ? rankingToForm(saved) : blogForm(saved);
      setSelected(saved); setForm(next); setSavedForm(JSON.stringify(next)); setKeyword(""); setNotice(`${category} #${saved.id} 저장했습니다.`);
    } catch (reason) { setError(reason.message); } finally { setBusy(false); }
  }
  async function remove() {
    if (busy || readOnly || !selected || !window.confirm(`${category} #${selected.id}을(를) 삭제할까요?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await memberApi(`${base}/${category}/${selected.id}`, { method: "DELETE" });
      setRecords((previous) => ({ ...previous, [category]: previous[category].filter((item) => item.id !== selected.id) }));
      if (["cafes", "rankings"].includes(category)) setReferences((previous) => ({ ...previous, [category]: previous[category].filter((item) => item.id !== selected.id) }));
      setSelected(null); setForm(null); setNotice("삭제했습니다.");
    } catch (reason) { setError(reason.message); } finally { setBusy(false); }
  }
  const cancel = () => { if (canLeave()) { setSelected(null); setForm(null); setError(""); } };

  return <>
    {error && <div className="crudError" role="alert">{error} {!ready && <button onClick={() => { setLoading(true); setError(""); setRetry((value) => value + 1); }} disabled={loading}>다시 불러오기</button>}</div>}
    {notice && <p className="crudNotice" role="status">{notice}</p>}
    {readOnly && <p className="crudNotice">로컬 JSON 조회 모드입니다. 등록·수정·삭제는 MongoDB 연결 후 사용할 수 있습니다.</p>}
    <div className="crudWorkspace">
      <nav className="crudCategories" aria-label="관리 카테고리"><h2>카테고리</h2>{categories.map((name) => <button key={name} aria-current={category === name ? "page" : undefined} onClick={() => changeCategory(name)} disabled={busy}>{name}{!enabled.has(name) && <small>준비 중</small>}</button>)}</nav>
      <aside className="crudList"><h2>{category} <small>{enabled.has(category) ? filtered.length : 0}</small></h2>
        {!enabled.has(category) ? <p className="crudEmpty">구조 확인 후 추가할 예정입니다.</p> : loading ? <p role="status">불러오는 중…</p> : <>{!filtered.length && <p className="crudEmpty">{keyword ? "검색 결과가 없습니다." : "등록된 정보가 없습니다."}</p>}{filtered.map((item) => <ListItem key={item._id || item.id} category={category} item={item} selected={selected} place={placeFor(item)} busy={busy} open={open} />)}</>}
      </aside>
      <section className="crudMain" aria-label="정보 입력">
        <div className="crudToolbar"><button className="crudPrimary" onClick={() => open(null)} disabled={!enabled.has(category) || busy || !ready || readOnly}>+ 추가</button><input aria-label="현재 카테고리 검색" type="search" placeholder="장소명, 주소, ID 검색" value={keyword} onChange={(event) => setKeyword(event.target.value)} disabled={!enabled.has(category)} /></div>
        {!enabled.has(category) ? <div className="crudEmpty">{category} 관리 기능은 준비 중입니다.</div> : !form ? <div className="crudEmpty">왼쪽 목록에서 항목을 선택하거나, 추가 버튼을 눌러 새 정보를 등록하세요.</div> : category === "cafes" ? <CafeForm form={form} setForm={setForm} selected={selected} busy={busy} readOnly={readOnly} dirty={dirty} onSave={save} onDelete={remove} onCancel={cancel} /> : category === "rankings" ? <RankingForm form={form} setForm={setForm} selected={selected} busy={busy} readOnly={readOnly} dirty={dirty} onSave={save} onDelete={remove} onCancel={cancel} /> : <BlogForm form={form} setForm={setForm} selected={selected} references={references} placeFor={placeFor} busy={busy} readOnly={readOnly} dirty={dirty} onSave={save} onDelete={remove} onCancel={cancel} />}
      </section>
    </div>
  </>;
}

function ListItem({ category, item, selected, place, busy, open }) {
  return <button className={selected?.id === item.id ? "isSelected" : ""} disabled={busy} onClick={() => open(item)} aria-pressed={selected?.id === item.id}>
    {category === "blogs" ? <><strong>{place?.name || `연결 장소 없음 #${item.otherID}`}</strong><span>#{item.id} · {item.typeTable} · {item.visibility === false ? "숨김" : "표시"}</span><small>{place?.address}</small></> : <><strong>{item.location?.name?.ko || item.location?.name?.en || `카페 #${item.id}`}</strong><span>#{item.id} · {item.visibility === false ? "숨김" : "표시"}</span><small>{(item.location?.address?.ko || []).join(" ")}</small></>}
  </button>;
}

function BlogForm({ form, setForm, selected, references, placeFor, busy, readOnly, dirty, onSave, onDelete, onCancel }) {
  const change = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  return <form className="crudForm" onSubmit={onSave}><div className="crudFormHeading"><h2>{selected ? `blogs #${selected.id} 수정` : "blogs 새로 등록"}</h2><p>{selected ? "기존 ID는 유지됩니다." : "ID는 저장 시 현재 최대 번호 다음으로 자동 부여됩니다."}{dirty && " · 저장하지 않은 변경 사항"}</p></div>
    <fieldset disabled={busy || readOnly}><label>표시 여부<select value={String(form.visibility)} onChange={(event) => change("visibility", event.target.value === "true")}><option value="true">표시</option><option value="false">숨김</option></select></label><label>연결 카테고리<select value={form.typeTable} onChange={(event) => setForm((previous) => ({ ...previous, typeTable: event.target.value, otherID: "" }))}>{["rankings", "cafes", "restaurants"].map((name) => <option key={name}>{name}</option>)}</select></label>
      <label className="crudFull">연결 장소<select required value={form.otherID} onChange={(event) => change("otherID", event.target.value)}><option value="">장소를 선택하세요</option>{form.otherID && !placeFor(form) && <option value={form.otherID}>연결 장소 없음 #{form.otherID} — 다시 선택하세요</option>}{(references[form.typeTable] || []).map((place) => <option key={place.id} value={place.id}>#{place.id} {place.name}</option>)}</select></label>
      <label>평점<input required type="number" min="0" max="5" step="0.01" value={form.stars} onChange={(event) => change("stars", event.target.value)} /></label><label>연결 장소 ID<input readOnly value={form.otherID} /></label><label>날짜 · 한국어<input required value={form.date.ko} onChange={(event) => change("date", { ...form.date, ko: event.target.value })} /></label><label>날짜 · 영어<input required value={form.date.en} onChange={(event) => change("date", { ...form.date, en: event.target.value })} /></label></fieldset>
    <Actions selected={selected} busy={busy} readOnly={readOnly} onDelete={onDelete} onCancel={onCancel} valid={Boolean(placeFor(form))} />
  </form>;
}

function Actions({ selected, busy, readOnly, onDelete, onCancel, valid }) {
  return <div className="crudActions">{selected && <button type="button" className="crudDanger" disabled={busy || readOnly} onClick={onDelete}>삭제</button>}<button type="button" disabled={busy} onClick={onCancel}>취소</button><button className="crudPrimary" disabled={busy || readOnly || !valid} type="submit">{busy ? "처리 중…" : "저장"}</button></div>;
}
