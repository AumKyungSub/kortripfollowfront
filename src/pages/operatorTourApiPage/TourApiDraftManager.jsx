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
});

const TourApiDraftManager = ({ refreshRequest }) => {
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(toForm());
  const [status, setStatus] = useState({ loading: true, saving: false, publishing: false, deleting: false, error: "", saved: false });

  const loadDrafts = async (focusExternalId = "") => {
    try {
      const data = await memberApi("/operator/external-places");
      const items = data || [];
      setDrafts(items);
      if (focusExternalId) {
        const savedPlace = items.find(item => item.externalId === focusExternalId);
        if (savedPlace) {
          setSelected(savedPlace);
          setForm(toForm(savedPlace));
        }
      }
      setStatus(value => ({ ...value, loading: false, error: "" }));
    } catch (error) {
      setStatus(value => ({ ...value, loading: false, error: error.message }));
    }
  };

  useEffect(() => {
    loadDrafts(refreshRequest?.externalId || "");
  }, [refreshRequest?.version]);

  const chooseDraft = draft => {
    setSelected(draft);
    setForm(toForm(draft));
    setStatus(value => ({ ...value, error: "", saved: false }));
  };

  const update = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));

  const save = async event => {
    event.preventDefault();
    if (!selected?._id || status.saving) return;
    setStatus(value => ({ ...value, saving: true, error: "", saved: false }));
    try {
      const updated = await memberApi(`/operator/external-places/${selected._id}`, { method: "PATCH", body: form });
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
  ].filter(Boolean);

  const publish = async () => {
    if (!selected?._id || status.saving || status.publishing || missingFields.length) return;
    if (!window.confirm("이 장소를 사이트에 공개할까요? 공개 후 지역 또는 테마 목록에 표시됩니다.")) return;
    setStatus(value => ({ ...value, publishing: true, error: "", saved: false }));
    try {
      await memberApi(`/operator/external-places/${selected._id}`, { method: "PATCH", body: form });
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
      <div className="tourApiSectionHeading"><span>STEP 3</span><div><h2>장소 정보 관리</h2><p>한국어와 대응되는 영문 TourAPI 자료가 있으면 자동 입력되며, 없는 항목만 직접 작성합니다.</p></div></div>
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
              <span><strong>{draft.name}</strong><small>{regionOptions.find(region => region.code === draft.regionCode)?.ko || draft.address}</small><small><em className={`tourDraftBadge ${draft.status}`}>{draft.status === "published" ? "공개" : "초안"}</em> TourAPI ID {draft.externalId}</small></span>
            </button>)}
          </div>
          {!selected ? <p className="tourApiEmpty">편집할 초안을 선택하세요.</p> : <form className="tourDraftForm" onSubmit={save}>
            <div className="tourDraftPreview">
              {selected.selectedImage?.thumbnailUrl
                ? <img src={selected.selectedImage.thumbnailUrl} alt={selected.name} />
                : <div className="tourDraftPreviewEmpty"><img src="/images/emptyBanner.jpg" alt="" /><strong>등록된 사진이 없어 대체 이미지를 사용합니다.</strong></div>}
              {selected.selectedImage?.provider && <span>사진 제공: {selected.selectedImage.provider}</span>}
            </div>
            <div className="tourDraftTwo"><label>장소 유형<select name="placeType" value={form.placeType} onChange={update}><option value="attraction">관광지</option><option value="cafe">카페</option><option value="restaurant">음식점</option><option value="lodging">숙박</option><option value="food">지역 음식</option></select></label><label>지역 코드<select name="regionCode" value={form.regionCode} onChange={update}>{regionOptions.map(region => <option key={region.code} value={region.code}>{region.ko} / {region.en}</option>)}</select></label></div>
            <div className="tourDraftTwo"><label>한국어 이름<input required maxLength={200} name="name" value={form.name} onChange={update} /></label><label>영어 이름<input maxLength={200} name="nameEn" value={form.nameEn} onChange={update} /></label></div>
            <div className="tourDraftTwo"><label>한국어 주소<input maxLength={500} name="address" value={form.address} onChange={update} /></label><label>영어 주소<input maxLength={500} name="addressEn" value={form.addressEn} onChange={update} /></label></div>
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
