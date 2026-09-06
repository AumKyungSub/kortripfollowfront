/* eslint-disable react-refresh/only-export-components */
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

const emptyMenu = () => ({ koName: "", price: "", enName: "" });
const priceDigits = (value) => String(value || "").replace(/\D/g, "");
const formattedPrice = (value) => {
  const digits = priceDigits(value);
  return digits ? Number(digits).toLocaleString("en-US") : "";
};
const emptyCafe = () => ({
  visibility: true,
  imageFolder: "",
  location: {
    name: { ko: "", en: "" },
    region: { code: "SEOUL", ko: "서울", en: "Seoul" },
    address: { ko: ["", ""], en: ["", ""] },
    latitude: "",
    longitude: "",
    placeID: "",
    homepage: "",
    instagram: "",
    chain: "",
    nearby: "",
  },
  description: {
    title: { ko: "", en: "" },
    slide: { ko: "", en: "" },
    menu: [emptyMenu()],
    menuLink: "",
  },
  info: { parking: false, takeOut: false, pet: false, reserve: false },
  hours: {
    mode: "daily",
    daily: "",
    weekday: "",
    weekend: "",
    breakTime: "",
    closedKo: "",
    closedEn: "",
    lastOrder: "",
  },
  videoLink: "",
  reviewLink: "",
});

const timeRange = (value = "") => value.match(/\d{1,2}:\d{2}\s*[~\-–—]\s*\d{1,2}:\d{2}/)?.[0] || "";
const noteValue = (items, words) => {
  const note = items.find((item) => item?.type === "note" && words.some((word) => item.text?.toLowerCase().includes(word)));
  if (!note) return "";
  return timeRange(note.text) || note.text.replace(/^.*?(?:시간|time|마감|order|휴무일|closed)\s*/i, "").trim();
};

export function newCafeForm() {
  return emptyCafe();
}

export function cafeToForm(item) {
  const form = emptyCafe();
  const imageLink = item.img?.link || "";
  const parts = imageLink.split("/").filter(Boolean);
  const coordinates = String(item.location?.latLng || "").split(",").map((value) => value.trim());
  const koOperating = item.operating?.ko || [];
  const enOperating = item.operating?.en || [];
  const times = koOperating.filter((entry) => entry?.type === "time");
  const isSplit = times.length > 1 || times.some((entry) => /평일|주말/.test(entry.label || ""));
  const readTime = (entry) => timeRange(entry?.value) || timeRange(entry?.label) || "";
  const menusKo = item.description?.menu?.ko || [];
  const menusEn = item.description?.menu?.en || [];

  return {
    ...form,
    visibility: item.visibility !== false,
    imageFolder: parts.at(-1) || "",
    location: {
      name: { ko: item.location?.name?.ko || "", en: item.location?.name?.en || "" },
      region: {
        code: item.location?.region?.code || "OTHER",
        ko: item.location?.region?.ko || "",
        en: item.location?.region?.en || "",
      },
      address: {
        ko: [item.location?.address?.ko?.[0] || "", item.location?.address?.ko?.[1] || ""],
        en: [item.location?.address?.en?.[0] || "", item.location?.address?.en?.[1] || ""],
      },
      latitude: coordinates[0] || "",
      longitude: coordinates[1] || "",
      placeID: String(item.location?.placeID || ""),
      homepage: item.location?.homepage || "",
      instagram: item.location?.instagram || "",
      chain: typeof item.location?.chain === "string" ? item.location.chain : item.location?.chain?.ko || "",
      nearby: item.location?.nearby || "",
    },
    description: {
      title: { ko: item.description?.title?.ko || "", en: item.description?.title?.en || "" },
      slide: { ko: item.description?.slide?.ko || "", en: item.description?.slide?.en || "" },
      menu: Array.from({ length: Math.max(menusKo.length, menusEn.length, 1) }, (_, index) => ({
        koName: menusKo[index]?.name || "",
        price: priceDigits(menusKo[index]?.price || menusEn[index]?.price),
        enName: menusEn[index]?.name || "",
      })),
      menuLink: item.description?.menuLink || "",
    },
    info: {
      parking: Boolean(item.info?.parking),
      takeOut: Boolean(item.info?.takeOut),
      pet: Boolean(item.info?.pet),
      reserve: Boolean(item.info?.reserve),
    },
    hours: {
      mode: isSplit ? "split" : "daily",
      daily: isSplit ? "" : readTime(times[0]),
      weekday: isSplit ? readTime(times[0]) : "",
      weekend: isSplit ? readTime(times[1]) : "",
      breakTime: noteValue(koOperating, ["브레이크", "break"]),
      closedKo: noteValue(koOperating, ["휴무", "closed"]),
      closedEn: noteValue(enOperating, ["closed"]),
      lastOrder: noteValue(koOperating, ["주문 마감", "라스트", "last order"]),
    },
    videoLink: item.video?.link || "",
    reviewLink: item.review?.link || "",
  };
}

export function cafePayload(form) {
  const menu = form.description.menu.filter((item) => (
    item.koName.trim() || item.price.trim() || item.enName.trim()
  ));
  const operating = { ko: [], en: [] };
  if (form.hours.mode === "daily") {
    operating.ko.push({ type: "time", label: "매일", value: form.hours.daily });
    operating.en.push({ type: "time", label: "Daily", value: form.hours.daily });
  } else {
    operating.ko.push({ type: "time", label: "평일", value: form.hours.weekday });
    operating.ko.push({ type: "time", label: "주말", value: form.hours.weekend });
    operating.en.push({ type: "time", label: "Weekdays", value: form.hours.weekday });
    operating.en.push({ type: "time", label: "Weekends", value: form.hours.weekend });
  }
  const addNote = (ko, en) => {
    if (ko.trim()) operating.ko.push({ type: "note", text: ko.trim() });
    if (en.trim()) operating.en.push({ type: "note", text: en.trim() });
  };
  if (form.hours.breakTime.trim()) addNote(`브레이크 타임 ${form.hours.breakTime}`, `Break time ${form.hours.breakTime}`);
  addNote(form.hours.closedKo, form.hours.closedEn);
  if (form.hours.lastOrder.trim()) addNote(`주문 마감 ${form.hours.lastOrder}`, `Last order ${form.hours.lastOrder}`);

  return {
    visibility: form.visibility,
    imageFolder: form.imageFolder,
    location: form.location,
    description: {
      title: form.description.title,
      slide: form.description.slide,
      menu: {
        ko: menu.map((item) => ({ name: item.koName, price: `${formattedPrice(item.price)}원` })),
        en: menu.map((item) => ({ name: item.enName, price: `KRW ${formattedPrice(item.price)}` })),
      },
      menuLink: form.description.menuLink,
    },
    info: form.info,
    operating,
    videoLink: form.videoLink,
    reviewLink: form.reviewLink,
  };
}

export function cafeSearchText(item) {
  return `${item.id} ${item.location?.name?.ko || ""} ${item.location?.name?.en || ""} ${(item.location?.address?.ko || []).join(" ")} ${item.location?.placeID || ""}`;
}

export default function CafeForm({ form, setForm, selected, busy, readOnly, dirty, onSave, onDelete, onCancel }) {
  const setNested = (group, key, value) => setForm((previous) => ({
    ...previous,
    [group]: { ...previous[group], [key]: value },
  }));
  const setLocalized = (group, key, language, value) => setForm((previous) => ({
    ...previous,
    [group]: {
      ...previous[group],
      [key]: { ...previous[group][key], [language]: value },
    },
  }));
  const setAddress = (language, index, value) => setForm((previous) => {
    const next = [...previous.location.address[language]];
    next[index] = value;
    return { ...previous, location: { ...previous.location, address: { ...previous.location.address, [language]: next } } };
  });
  const setMenu = (index, key, value) => setForm((previous) => {
    const menu = previous.description.menu.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item);
    return { ...previous, description: { ...previous.description, menu } };
  });
  const moveMenu = (index, direction) => setForm((previous) => {
    const menu = [...previous.description.menu];
    const target = index + direction;
    if (target < 0 || target >= menu.length) return previous;
    [menu[index], menu[target]] = [menu[target], menu[index]];
    return { ...previous, description: { ...previous.description, menu } };
  });
  const removeMenu = (index) => setForm((previous) => ({
    ...previous,
    description: { ...previous.description, menu: previous.description.menu.filter((_, itemIndex) => itemIndex !== index) },
  }));
  const chooseRegion = (code) => setForm((previous) => {
    const option = regionOptions.find((region) => region.code === code);
    return { ...previous, location: { ...previous.location, region: { code, ko: option?.ko || "", en: option?.en || "" } } };
  });

  return <form className="crudForm" onSubmit={onSave}>
    <div className="crudFormHeading"><h2>{selected ? `cafes #${selected.id} 수정` : "cafes 새로 등록"}</h2><p>{selected ? "기존 ID는 유지됩니다." : "ID는 저장 시 현재 최대 번호 다음으로 자동 부여됩니다."}{dirty && " · 저장하지 않은 변경 사항"}</p></div>
    <fieldset disabled={busy || readOnly}>
      <legend>기본 설정</legend>
      <label>표시 여부<select value={String(form.visibility)} onChange={(event) => setForm((previous) => ({ ...previous, visibility: event.target.value === "true" }))}><option value="true">표시</option><option value="false">숨김</option></select></label>
      <label>이미지 폴더명<input required pattern="[A-Za-z0-9_-]+" value={form.imageFolder} onChange={(event) => setForm((previous) => ({ ...previous, imageFolder: event.target.value }))} placeholder="cafesan" /></label>
      <p className="crudFull crudPath">저장 경로: /images/detailTheme/{form.imageFolder || "폴더명"}/{form.imageFolder || "폴더명"}</p>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>장소 정보</legend>
      <label>장소명 · 한국어<input required value={form.location.name.ko} onChange={(event) => setLocalized("location", "name", "ko", event.target.value)} /></label>
      <label>장소명 · 영어<input required value={form.location.name.en} onChange={(event) => setLocalized("location", "name", "en", event.target.value)} /></label>
      <label>지역 코드<select value={form.location.region.code} onChange={(event) => chooseRegion(event.target.value)}>{regionOptions.map((region) => <option key={region.code} value={region.code}>{region.code} · {region.ko}</option>)}</select></label>
      <label>지역명 · 한국어<input required value={form.location.region.ko} onChange={(event) => setForm((previous) => ({ ...previous, location: { ...previous.location, region: { ...previous.location.region, ko: event.target.value } } }))} /></label>
      <label>지역명 · 영어<input required value={form.location.region.en} onChange={(event) => setForm((previous) => ({ ...previous, location: { ...previous.location, region: { ...previous.location.region, en: event.target.value } } }))} /></label>
      <span />
      {[0, 1].map((index) => <label key={`ko-${index}`}>주소 · 한국어 {index + 1}<input required value={form.location.address.ko[index]} onChange={(event) => setAddress("ko", index, event.target.value)} /></label>)}
      {[0, 1].map((index) => <label key={`en-${index}`}>주소 · 영어 {index + 1}<input required value={form.location.address.en[index]} onChange={(event) => setAddress("en", index, event.target.value)} /></label>)}
      <label>위도<input required type="number" step="any" min="-90" max="90" value={form.location.latitude} onChange={(event) => setNested("location", "latitude", event.target.value)} /></label>
      <label>경도<input required type="number" step="any" min="-180" max="180" value={form.location.longitude} onChange={(event) => setNested("location", "longitude", event.target.value)} /></label>
      <label>Kakao 장소 ID<input required value={form.location.placeID} onChange={(event) => setNested("location", "placeID", event.target.value)} /></label>
      <label>체인 정보<input value={form.location.chain} onChange={(event) => setNested("location", "chain", event.target.value)} /></label>
      <label>홈페이지 URL<input type="url" value={form.location.homepage} onChange={(event) => setNested("location", "homepage", event.target.value)} /></label>
      <label>Instagram URL<input type="url" value={form.location.instagram} onChange={(event) => setNested("location", "instagram", event.target.value)} /></label>
      <label className="crudFull">주변 정보<input value={form.location.nearby} onChange={(event) => setNested("location", "nearby", event.target.value)} /></label>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>설명</legend>
      <label>제목 · 한국어<input required value={form.description.title.ko} onChange={(event) => setLocalized("description", "title", "ko", event.target.value)} /></label>
      <label>제목 · 영어<input required value={form.description.title.en} onChange={(event) => setLocalized("description", "title", "en", event.target.value)} /></label>
      <label>내용 · 한국어<textarea required rows="5" value={form.description.slide.ko} onChange={(event) => setLocalized("description", "slide", "ko", event.target.value)} /></label>
      <label>내용 · 영어<textarea required rows="5" value={form.description.slide.en} onChange={(event) => setLocalized("description", "slide", "en", event.target.value)} /></label>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>메뉴</legend>
      <div className="crudFull crudMenuList">{form.description.menu.map((item, index) => <div className="crudMenuRow" key={index}>
        <strong>{index + 1}</strong>
        <input aria-label={`메뉴 ${index + 1} 한국어 이름`} required value={item.koName} onChange={(event) => setMenu(index, "koName", event.target.value)} placeholder="한국어 메뉴명" />
        <label className="crudMenuPrice"><span className="srOnly">메뉴 {index + 1} 가격</span><input aria-label={`메뉴 ${index + 1} 가격`} required inputMode="numeric" pattern="[0-9]+" value={item.price} onChange={(event) => setMenu(index, "price", priceDigits(event.target.value))} placeholder="6500" /><small>{item.price ? `${formattedPrice(item.price)}원 · KRW ${formattedPrice(item.price)}` : "숫자만 입력"}</small></label>
        <input aria-label={`메뉴 ${index + 1} 영어 이름`} required value={item.enName} onChange={(event) => setMenu(index, "enName", event.target.value)} placeholder="English name" />
        <div><button type="button" onClick={() => moveMenu(index, -1)} disabled={index === 0}>↑</button><button type="button" onClick={() => moveMenu(index, 1)} disabled={index === form.description.menu.length - 1}>↓</button><button type="button" onClick={() => removeMenu(index)}>삭제</button></div>
      </div>)}</div>
      <button type="button" onClick={() => setForm((previous) => ({ ...previous, description: { ...previous.description, menu: [...previous.description.menu, emptyMenu()] } }))}>+ 메뉴 추가</button>
      <label>전체 메뉴 URL<input type="url" value={form.description.menuLink} onChange={(event) => setNested("description", "menuLink", event.target.value)} /></label>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>편의시설</legend>
      <div className="crudFull crudChecks">{Object.entries({ parking: "주차", takeOut: "포장", pet: "반려동물", reserve: "예약" }).map(([key, label]) => <label key={key}><input type="checkbox" checked={form.info[key]} onChange={(event) => setNested("info", key, event.target.checked)} />{label}</label>)}</div>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>영업 정보</legend>
      <label>영업시간 구분<select value={form.hours.mode} onChange={(event) => setNested("hours", "mode", event.target.value)}><option value="daily">매일 동일</option><option value="split">평일·주말 구분</option></select></label>
      <span />
      {form.hours.mode === "daily" ? <label className="crudFull">매일 영업시간<input required value={form.hours.daily} onChange={(event) => setNested("hours", "daily", event.target.value)} placeholder="11:00 ~ 21:30" /></label> : <><label>평일 영업시간<input required value={form.hours.weekday} onChange={(event) => setNested("hours", "weekday", event.target.value)} placeholder="09:30 ~ 19:00" /></label><label>주말 영업시간<input required value={form.hours.weekend} onChange={(event) => setNested("hours", "weekend", event.target.value)} placeholder="09:30 ~ 19:30" /></label></>}
      <label>브레이크 타임<input value={form.hours.breakTime} onChange={(event) => setNested("hours", "breakTime", event.target.value)} placeholder="15:00 ~ 16:00" /></label>
      <label>주문 마감<input value={form.hours.lastOrder} onChange={(event) => setNested("hours", "lastOrder", event.target.value)} placeholder="20:40" /></label>
      <label>휴무일 · 한국어<input value={form.hours.closedKo} onChange={(event) => setNested("hours", "closedKo", event.target.value)} placeholder="매주 월요일 휴무" /></label>
      <label>휴무일 · 영어<input value={form.hours.closedEn} onChange={(event) => setNested("hours", "closedEn", event.target.value)} placeholder="Closed every Monday" /></label>
    </fieldset>
    <fieldset disabled={busy || readOnly}>
      <legend>영상 및 리뷰</legend>
      <label>영상 URL<input type="url" value={form.videoLink} onChange={(event) => setForm((previous) => ({ ...previous, videoLink: event.target.value }))} placeholder="https://www.youtube.com/embed/..." /></label>
      <label>리뷰 URL<input type="url" value={form.reviewLink} onChange={(event) => setForm((previous) => ({ ...previous, reviewLink: event.target.value }))} placeholder="https://blog.naver.com/..." /></label>
      <p className="crudFull crudPath">URL이 있으면 공개 여부가 true, 비어 있으면 false로 저장됩니다.</p>
    </fieldset>
    <div className="crudActions">{selected && <button type="button" className="crudDanger" disabled={busy || readOnly} onClick={onDelete}>삭제</button>}<button type="button" disabled={busy} onClick={onCancel}>취소</button><button className="crudPrimary" disabled={busy || readOnly} type="submit">{busy ? "처리 중…" : "저장"}</button></div>
  </form>;
}
