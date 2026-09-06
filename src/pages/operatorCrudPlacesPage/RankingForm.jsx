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
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const seasons = ["SPRING", "SUMMER", "FALL", "WINTER"];
const parkingLevels = ["아주 쉬움", "쉬움", "보통", "어려움", "많이 어려움"];
const blankRow = (kind = "fee") => ({
  kind, titleKo: "", titleEn: "", labelKo: "", labelEn: "", valueKo: "", valueEn: "",
  expKo: "", expEn: "", expsKo: "", expsEn: "", textKo: "", textEn: "", startMonth: "1", endMonth: "1",
});
const digits = (value) => String(value || "").replace(/\D/g, "");
const money = (value) => digits(value) ? Number(digits(value)).toLocaleString("en-US") : "";
const coordinates = (value) => String(value || "").split(",").map((part) => part.trim());
const nullText = (value) => value == null ? "" : String(value);

const emptyRanking = () => ({
  visibility: true,
  imageFolder: "",
  location: {
    name: { ko: "", en: "" }, region: { code: "SEOUL", ko: "서울", en: "Seoul" },
    address: { ko: ["", ""], en: ["", ""] }, latitude: "", longitude: "", placeID: "", homepage: "", instagram: "", nearby: "",
  },
  description: Object.fromEntries(["short", "slide", "title", "main", "last"].map((key) => [key, { ko: "", en: "" }])),
  parking: { existence: false, fee: false, address: { ko: "", en: "" }, latitude: "", longitude: "", level: "3", legacyLevel: "" },
  operating: { hourMode: "general", operatingHour: [], closeDay: [], entranceFee: [], etcFee: [] },
  videoLink: "", reviewLink: "", season: [],
});

function pairedRows(value) {
  const ko = value?.ko || [];
  const en = value?.en || [];
  return Array.from({ length: Math.max(ko.length, en.length) }, (_, index) => {
    const left = ko[index] || {};
    const right = en[index] || {};
    const kind = left.type === "sub" || right.type === "sub" ? "sub" : "fee";
    return {
      ...blankRow(kind), kind,
      titleKo: nullText(left.title), titleEn: nullText(right.title), labelKo: nullText(left.label), labelEn: nullText(right.label),
      valueKo: nullText(left.value), valueEn: nullText(right.value), expKo: nullText(left.exp), expEn: nullText(right.exp),
      expsKo: nullText(left.exps), expsEn: nullText(right.exps), textKo: nullText(left.text), textEn: nullText(right.text),
    };
  });
}

function detectHourMode(value) {
  const feeRows = value?.ko?.filter((row) => row.type === "fee") || [];
  if (feeRows.length && feeRows.every((row) => /^\d{1,2}월(?:\s*[~～\-–—]\s*\d{1,2}월)?$/.test(row.title || ""))) return "monthly";
  if (feeRows.length && feeRows.every((row) => row.title && !row.label)) return "typed";
  return "general";
}

function parseMonthTitle(title) {
  const values = String(title || "").match(/\d{1,2}/g) || [];
  return [values[0] || "1", values[1] || values[0] || "1"];
}

export function newRankingForm() { return emptyRanking(); }

export function rankingToForm(item) {
  const form = emptyRanking();
  const locationCoordinates = coordinates(item.location?.latLng);
  const parkingCoordinates = coordinates(item.parking?.latLng);
  const imageParts = String(item.img?.link || "").split("/").filter(Boolean);
  const hourMode = detectHourMode(item.operating?.operatingHour);
  const hourRows = pairedRows(item.operating?.operatingHour).map((row) => {
    if (hourMode !== "monthly" || row.kind === "sub") return row;
    const [startMonth, endMonth] = parseMonthTitle(row.titleKo);
    return { ...row, startMonth, endMonth };
  });
  const level = nullText(item.parking?.level);
  return {
    ...form,
    visibility: item.visibility !== false,
    imageFolder: imageParts.at(-1) || "",
    location: {
      name: { ko: item.location?.name?.ko || "", en: item.location?.name?.en || "" },
      region: { code: item.location?.region?.code || "OTHER", ko: item.location?.region?.ko || "", en: item.location?.region?.en || "" },
      address: { ko: [item.location?.address?.ko?.[0] || "", item.location?.address?.ko?.[1] || ""], en: [item.location?.address?.en?.[0] || "", item.location?.address?.en?.[1] || ""] },
      latitude: locationCoordinates[0] || "", longitude: locationCoordinates[1] || "", placeID: nullText(item.location?.placeID),
      homepage: item.location?.homepage || "", instagram: item.location?.instagram || "", nearby: item.location?.nearby || "",
    },
    description: Object.fromEntries(["short", "slide", "title", "main", "last"].map((key) => [key, { ko: item.description?.[key]?.ko || "", en: item.description?.[key]?.en || "" }])),
    parking: {
      existence: Boolean(item.parking?.existence), fee: Boolean(item.parking?.fee),
      address: { ko: item.parking?.address?.ko || "", en: item.parking?.address?.en || "" },
      latitude: parkingCoordinates[0] || "", longitude: parkingCoordinates[1] || "", level: level || "3", legacyLevel: level,
    },
    operating: {
      hourMode, operatingHour: hourRows, closeDay: pairedRows(item.operating?.closeDay),
      entranceFee: pairedRows(item.operating?.entranceFee), etcFee: pairedRows(item.operating?.etcFee),
    },
    videoLink: item.video?.link || "", reviewLink: item.review?.link || "", season: Array.isArray(item.season) ? item.season.filter((value) => seasons.includes(value)) : [],
  };
}

function rowHasLanguage(row, language) {
  const suffix = language === "ko" ? "Ko" : "En";
  return row.kind === "sub" ? Boolean(row[`text${suffix}`].trim()) : ["title", "label", "value", "exp", "exps"].some((key) => row[`${key}${suffix}`].trim());
}

function rowsPayload(rows, mode = "general") {
  const result = { ko: [], en: [] };
  for (const row of rows) {
    for (const language of ["ko", "en"]) {
      const suffix = language === "ko" ? "Ko" : "En";
      if (row.kind === "sub") {
        if (row[`text${suffix}`].trim()) result[language].push({ type: "sub", text: row[`text${suffix}`] });
        continue;
      }
      let title = row[`title${suffix}`];
      let label = row[`label${suffix}`];
      let value = row[`value${suffix}`];
      if (mode === "monthly") {
        const start = Number(row.startMonth);
        const end = Math.max(start, Number(row.endMonth));
        title = language === "ko" ? `${start}월${start === end ? "" : `~${end}월`}` : `${months[start - 1]}${start === end ? "" : `–${months[end - 1]}`}`;
        label = "";
        value = row.valueKo || row.valueEn;
      } else if (mode === "typed") {
        label = "";
        value = row.valueKo || row.valueEn;
      }
      const normalized = { ...row, [`title${suffix}`]: title, [`label${suffix}`]: label, [`value${suffix}`]: value };
      if (!rowHasLanguage(normalized, language)) continue;
      result[language].push({ type: "fee", title: title || null, label: label || null, value: value || null, exp: row[`exp${suffix}`] || null, exps: row[`exps${suffix}`] || null });
    }
  }
  return result.ko.length || result.en.length ? result : null;
}

export function rankingPayload(form) {
  return {
    visibility: form.visibility, imageFolder: form.imageFolder, location: form.location, description: form.description,
    parking: form.parking,
    operating: {
      operatingHour: rowsPayload(form.operating.operatingHour, form.operating.hourMode),
      closeDay: rowsPayload(form.operating.closeDay), entranceFee: rowsPayload(form.operating.entranceFee), etcFee: rowsPayload(form.operating.etcFee),
    },
    videoLink: form.videoLink, reviewLink: form.reviewLink, season: form.season,
  };
}

export function rankingSearchText(item) {
  return `${item.id} ${item.location?.name?.ko || ""} ${item.location?.name?.en || ""} ${(item.location?.address?.ko || []).join(" ")} ${item.location?.placeID || ""}`;
}

function RowEditor({ row, index, rows, setRows, mode = "general", fees = false }) {
  const update = (key, value) => setRows(rows.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const move = (direction) => {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  };
  const setPrice = (value) => {
    const valueDigits = digits(value);
    setRows((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, valueKo: valueDigits ? `${money(valueDigits)}원` : "", valueEn: valueDigits ? `KRW ${money(valueDigits)}` : "" } : item));
  };
  if (row.kind === "sub") return <div className="crudRankingRow crudRankingNote">
    <strong>{index + 1}</strong><textarea rows="2" value={row.textKo} onChange={(event) => update("textKo", event.target.value)} placeholder="한국어 안내문" /><textarea rows="2" value={row.textEn} onChange={(event) => update("textEn", event.target.value)} placeholder="English note" />
    <RowActions index={index} count={rows.length} move={move} remove={() => setRows(rows.filter((_, itemIndex) => itemIndex !== index))} />
  </div>;
  return <div className="crudRankingRow">
    <strong>{index + 1}</strong>
    {mode === "monthly" ? <div className="crudMonthRange"><select value={row.startMonth} onChange={(event) => update("startMonth", event.target.value)}>{months.map((month, monthIndex) => <option key={month} value={monthIndex + 1}>{monthIndex + 1}월</option>)}</select><span>~</span><select value={row.endMonth} onChange={(event) => update("endMonth", event.target.value)}>{months.map((month, monthIndex) => <option key={month} value={monthIndex + 1}>{monthIndex + 1}월</option>)}</select></div> : <><input value={row.titleKo} onChange={(event) => update("titleKo", event.target.value)} placeholder={mode === "typed" ? "종류 · 한국어" : "구분 · 한국어"} /><input value={row.titleEn} onChange={(event) => update("titleEn", event.target.value)} placeholder={mode === "typed" ? "Type · English" : "Category · English"} /></>}
    {mode === "general" && <><input value={row.labelKo} onChange={(event) => update("labelKo", event.target.value)} placeholder="항목 · 한국어" /><input value={row.labelEn} onChange={(event) => update("labelEn", event.target.value)} placeholder="Item · English" /></>}
    {fees ? <div className="crudPriceInput"><input inputMode="numeric" value={digits(row.valueKo)} onChange={(event) => setPrice(event.target.value)} placeholder="숫자만 입력" /><button type="button" onClick={() => setRows(rows.map((item, itemIndex) => itemIndex === index ? { ...item, valueKo: "무료", valueEn: "Free" } : item))}>무료</button><small>{row.valueKo && `${row.valueKo} · ${row.valueEn}`}</small></div> : <input className="crudTimeInput" value={row.valueKo || row.valueEn} onChange={(event) => setRows(rows.map((item, itemIndex) => itemIndex === index ? { ...item, valueKo: event.target.value, valueEn: event.target.value } : item))} placeholder="09:00 ~ 18:00" />}
    <input value={row.expKo} onChange={(event) => update("expKo", event.target.value)} placeholder="위 설명 · 한국어" /><input value={row.expEn} onChange={(event) => update("expEn", event.target.value)} placeholder="Upper note · English" />
    <input value={row.expsKo} onChange={(event) => update("expsKo", event.target.value)} placeholder="아래 설명 · 한국어" /><input value={row.expsEn} onChange={(event) => update("expsEn", event.target.value)} placeholder="Lower note · English" />
    <RowActions index={index} count={rows.length} move={move} remove={() => setRows(rows.filter((_, itemIndex) => itemIndex !== index))} />
  </div>;
}

function RowActions({ index, count, move, remove }) {
  return <div className="crudRowActions"><button type="button" disabled={index === 0} onClick={() => move(-1)}>↑</button><button type="button" disabled={index === count - 1} onClick={() => move(1)}>↓</button><button type="button" onClick={remove}>삭제</button></div>;
}

function RowsSection({ title, rows, setRows, mode = "general", fees = false, disabled = false }) {
  return <fieldset disabled={disabled}><legend>{title}</legend><div className="crudFull crudRankingRows">{rows.map((row, index) => <RowEditor key={index} row={row} index={index} rows={rows} setRows={setRows} mode={mode} fees={fees} />)}</div><div className="crudFull crudAddButtons"><button type="button" onClick={() => setRows([...rows, blankRow()])}>+ 일반 항목</button><button type="button" onClick={() => setRows([...rows, blankRow("sub")])}>+ 안내문</button></div></fieldset>;
}

export default function RankingForm({ form, setForm, selected, busy, readOnly, dirty, onSave, onDelete, onCancel }) {
  const setNested = (group, key, value) => setForm((previous) => ({ ...previous, [group]: { ...previous[group], [key]: value } }));
  const setLocalized = (group, key, language, value) => setForm((previous) => ({ ...previous, [group]: { ...previous[group], [key]: { ...previous[group][key], [language]: value } } }));
  const setAddress = (language, index, value) => setForm((previous) => { const next = [...previous.location.address[language]]; next[index] = value; return { ...previous, location: { ...previous.location, address: { ...previous.location.address, [language]: next } } }; });
  const setOperating = (key, value) => setForm((previous) => ({ ...previous, operating: { ...previous.operating, [key]: typeof value === "function" ? value(previous.operating[key]) : value } }));
  const chooseRegion = (code) => setForm((previous) => { const option = regionOptions.find((region) => region.code === code); return { ...previous, location: { ...previous.location, region: { code, ko: option?.ko || "", en: option?.en || "" } } }; });
  const toggleSeason = (season) => setForm((previous) => ({ ...previous, season: previous.season.includes(season) ? previous.season.filter((value) => value !== season) : seasons.filter((value) => value === season || previous.season.includes(value)) }));
  return <form className="crudForm" onSubmit={onSave}>
    <div className="crudFormHeading"><h2>{selected ? `rankings #${selected.id} 수정` : "rankings 새로 등록"}</h2><p>{selected ? "기존 ID와 top 값은 유지됩니다." : "ID는 최대 번호 다음으로 자동 부여되며 top은 빈 값으로 저장됩니다."}{dirty && " · 저장하지 않은 변경 사항"}</p></div>
    <fieldset disabled={busy || readOnly}><legend>기본 설정</legend><label>표시 여부<select value={String(form.visibility)} onChange={(event) => setForm((previous) => ({ ...previous, visibility: event.target.value === "true" }))}><option value="true">표시</option><option value="false">숨김</option></select></label><label>이미지 폴더명<input required pattern="[A-Za-z0-9_-]+" value={form.imageFolder} onChange={(event) => setForm((previous) => ({ ...previous, imageFolder: event.target.value }))} placeholder="yeonmijeong" /></label><p className="crudFull crudPath">저장 경로: /images/detailLocation/{form.imageFolder || "폴더명"}/{form.imageFolder || "폴더명"}</p></fieldset>
    <fieldset disabled={busy || readOnly}><legend>장소 정보</legend><label>장소명 · 한국어<input required value={form.location.name.ko} onChange={(event) => setLocalized("location", "name", "ko", event.target.value)} /></label><label>장소명 · 영어<input required value={form.location.name.en} onChange={(event) => setLocalized("location", "name", "en", event.target.value)} /></label><label>지역 코드<select value={form.location.region.code} onChange={(event) => chooseRegion(event.target.value)}>{regionOptions.map((region) => <option key={region.code} value={region.code}>{region.code} · {region.ko}</option>)}</select></label><label>지역명 · 한국어<input required value={form.location.region.ko} onChange={(event) => setForm((previous) => ({ ...previous, location: { ...previous.location, region: { ...previous.location.region, ko: event.target.value } } }))} /></label><label>지역명 · 영어<input required value={form.location.region.en} onChange={(event) => setForm((previous) => ({ ...previous, location: { ...previous.location, region: { ...previous.location.region, en: event.target.value } } }))} /></label><span />
      {[0, 1].map((index) => <label key={`ko-${index}`}>주소 · 한국어 {index + 1}<input required value={form.location.address.ko[index]} onChange={(event) => setAddress("ko", index, event.target.value)} /></label>)}{[0, 1].map((index) => <label key={`en-${index}`}>주소 · 영어 {index + 1}<input required value={form.location.address.en[index]} onChange={(event) => setAddress("en", index, event.target.value)} /></label>)}
      <label>위도<input required type="number" step="any" min="-90" max="90" value={form.location.latitude} onChange={(event) => setNested("location", "latitude", event.target.value)} /></label><label>경도<input required type="number" step="any" min="-180" max="180" value={form.location.longitude} onChange={(event) => setNested("location", "longitude", event.target.value)} /></label><label>Kakao 장소 ID<input required value={form.location.placeID} onChange={(event) => setNested("location", "placeID", event.target.value)} /></label><span /><label>홈페이지 URL<input type="url" value={form.location.homepage} onChange={(event) => setNested("location", "homepage", event.target.value)} /></label><label>Instagram URL<input type="url" value={form.location.instagram} onChange={(event) => setNested("location", "instagram", event.target.value)} /></label><label className="crudFull">주변 정보<input value={form.location.nearby} onChange={(event) => setNested("location", "nearby", event.target.value)} /></label>
    </fieldset>
    <fieldset disabled={busy || readOnly}><legend>설명</legend>{[["short", "소개글", 2], ["slide", "배너글", 4], ["title", "제목", 2], ["main", "설명문", 8], ["last", "마무리글", 5]].map(([key, label, rows]) => <div className="crudFull crudLocalizedPair" key={key}><label>{label} · 한국어<textarea required rows={rows} value={form.description[key].ko} onChange={(event) => setLocalized("description", key, "ko", event.target.value)} /></label><label>{label} · 영어<textarea required rows={rows} value={form.description[key].en} onChange={(event) => setLocalized("description", key, "en", event.target.value)} /></label></div>)}</fieldset>
    <fieldset disabled={busy || readOnly}><legend>주차 정보</legend><div className="crudFull crudChecks"><label><input type="checkbox" checked={form.parking.existence} onChange={(event) => setNested("parking", "existence", event.target.checked)} />주차 가능</label><label><input type="checkbox" checked={form.parking.fee} disabled={!form.parking.existence} onChange={(event) => setNested("parking", "fee", event.target.checked)} />유료 주차</label></div>{form.parking.existence && <><label>주차장 주소 · 한국어<input required value={form.parking.address.ko} onChange={(event) => setForm((previous) => ({ ...previous, parking: { ...previous.parking, address: { ...previous.parking.address, ko: event.target.value } } }))} /></label><label>주차장 주소 · 영어<input required value={form.parking.address.en} onChange={(event) => setForm((previous) => ({ ...previous, parking: { ...previous.parking, address: { ...previous.parking.address, en: event.target.value } } }))} /></label><label>주차장 위도<input required type="number" step="any" value={form.parking.latitude} onChange={(event) => setNested("parking", "latitude", event.target.value)} /></label><label>주차장 경도<input required type="number" step="any" value={form.parking.longitude} onChange={(event) => setNested("parking", "longitude", event.target.value)} /></label><label>주차 난이도<select value={form.parking.level} onChange={(event) => setNested("parking", "level", event.target.value)}>{form.parking.legacyLevel && !["1", "2", "3", "4", "5"].includes(form.parking.legacyLevel) && <option value={form.parking.legacyLevel}>기존값 {form.parking.legacyLevel} (변경 전까지 유지)</option>}{parkingLevels.map((label, index) => <option key={label} value={index + 1}>{index + 1} · {label}</option>)}</select></label></>}</fieldset>
    <fieldset disabled={busy || readOnly}><legend>운영시간</legend><label>입력 유형<select value={form.operating.hourMode} onChange={(event) => setOperating("hourMode", event.target.value)}><option value="general">일반</option><option value="monthly">월별</option><option value="typed">종류별</option></select></label><p className="crudFull crudPath">유형을 바꿔도 현재 행은 유지됩니다. 월별 제목의 영어 월 표기는 자동 생성됩니다.</p><div className="crudFull crudRankingRows">{form.operating.operatingHour.map((row, index) => <RowEditor key={index} row={row} index={index} rows={form.operating.operatingHour} setRows={(value) => setOperating("operatingHour", value)} mode={form.operating.hourMode} />)}</div><div className="crudFull crudAddButtons"><button type="button" onClick={() => setOperating("operatingHour", (rows) => [...rows, blankRow()])}>+ 운영시간</button><button type="button" onClick={() => setOperating("operatingHour", (rows) => [...rows, blankRow("sub")])}>+ 안내문</button></div></fieldset>
    <RowsSection title="휴무일" rows={form.operating.closeDay} setRows={(value) => setOperating("closeDay", value)} disabled={busy || readOnly} /><RowsSection title="입장료" rows={form.operating.entranceFee} setRows={(value) => setOperating("entranceFee", value)} fees disabled={busy || readOnly} /><RowsSection title="기타 요금" rows={form.operating.etcFee} setRows={(value) => setOperating("etcFee", value)} fees disabled={busy || readOnly} />
    <fieldset disabled={busy || readOnly}><legend>추천 계절</legend><div className="crudFull crudChecks">{seasons.map((season) => <label key={season}><input type="checkbox" checked={form.season.includes(season)} onChange={() => toggleSeason(season)} />{season}</label>)}</div></fieldset>
    <fieldset disabled={busy || readOnly}><legend>영상 및 리뷰</legend><label>영상 URL<input type="url" value={form.videoLink} onChange={(event) => setForm((previous) => ({ ...previous, videoLink: event.target.value }))} /></label><label>리뷰 URL<input type="url" value={form.reviewLink} onChange={(event) => setForm((previous) => ({ ...previous, reviewLink: event.target.value }))} /></label><p className="crudFull crudPath">URL이 있으면 existence=true, 비어 있으면 false로 저장됩니다.</p></fieldset>
    <div className="crudActions">{selected && <button type="button" className="crudDanger" disabled={busy || readOnly} onClick={onDelete}>삭제</button>}<button type="button" disabled={busy} onClick={onCancel}>취소</button><button className="crudPrimary" disabled={busy || readOnly} type="submit">{busy ? "처리 중…" : "저장"}</button></div>
  </form>;
}
