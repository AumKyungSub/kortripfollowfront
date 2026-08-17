import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Map as KakaoMap, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';
import Header from '@/widgets/header/Header';
import Footer from '@/widgets/footer/Footer';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ApiError, memberApi, placePath } from '@/shared/api/memberApi';
import './MemberPage.style.css';

const emptyCourse = { title: '', description: '', visibility: 'private', date: '', endDate: '', selected: [] };
const emptyVisit = { placeKey: '', visitedAt: new Date().toISOString().slice(0, 10), rating: '', memo: '' };

const copy = {
  ko: {
    eyebrow: 'MY KORTRIP', title: '내 여행', subtitle: '찜한 장소를 지도에서 보고 여행 코스와 방문 기록을 관리하세요.',
    favorites: '내 찜', courses: '여행 코스', visits: '방문 기록', login: '로그인이 필요한 페이지입니다.',
    loginHint: '오른쪽 위 프로필 버튼에서 소셜 로그인을 진행해 주세요.', emptyFavorite: '아직 찜한 장소가 없습니다.',
    emptyCourse: '아직 만든 여행 코스가 없습니다.', emptyVisit: '아직 방문 기록이 없습니다.', createCourse: '코스 저장',
    updateCourse: '수정 저장', createVisit: '방문 기록 저장', updateVisit: '수정 저장', cancel: '취소', remove: '삭제', edit: '수정',
    titleLabel: '코스 이름', description: '설명', visibility: '공개 범위', date: '여행 날짜', places: '코스에 담을 찜 장소',
    place: '장소', rating: '평점', memo: '메모', visitDate: '방문 날짜', private: '비공개', unlisted: '링크 공개', public: '전체 공개',
    map: '찜 지도', noMap: '지도에 표시할 장소가 없습니다.', loadError: '데이터를 불러오지 못했습니다.', saveError: '저장하지 못했습니다.',
    open: '상세 보기', share: '링크 복사', copied: '복사됨', selectPlace: '장소를 선택하세요', searchPlace: '장소명·지역·주소 검색', noPlaceResult: '검색 결과가 없습니다.',
    favoriteView: '찜 목록 보기 방식', defaultView: '기본 보기', groupByRegion: '지역별 그룹', unknownRegion: '기타 지역',
    courseNamePlaceholder: '예: 서울 역사 문화 투어', descriptionPlaceholder: '코스에 대한 간단한 설명을 입력하세요', startDate: '여행 시작일', endDate: '여행 종료일', savedCourses: '저장된 코스', noDescription: '코스 설명이 없습니다.',
    visitMemoPlaceholder: '방문 소감이나 팁을 남겨보세요', chooseRating: '선택', visitHistory: '방문 기록'
  },
  en: {
    eyebrow: 'MY KORTRIP', title: 'My trip', subtitle: 'See saved places on the map and manage itineraries and visit history.',
    favorites: 'Saved', courses: 'Itineraries', visits: 'Visits', login: 'Please sign in to use this page.',
    loginHint: 'Use the profile button in the top-right corner to continue with social login.', emptyFavorite: 'No saved places yet.',
    emptyCourse: 'No itineraries yet.', emptyVisit: 'No visits yet.', createCourse: 'Save itinerary', updateCourse: 'Save changes',
    createVisit: 'Save visit', updateVisit: 'Save changes', cancel: 'Cancel', remove: 'Delete', edit: 'Edit', titleLabel: 'Title',
    description: 'Description', visibility: 'Visibility', date: 'Travel date', places: 'Saved places in this itinerary', place: 'Place',
    rating: 'Rating', memo: 'Memo', visitDate: 'Visited on', private: 'Private', unlisted: 'Unlisted', public: 'Public', map: 'Saved places map',
    noMap: 'There are no places to show.', loadError: 'Could not load your data.', saveError: 'Could not save changes.', open: 'View details',
    share: 'Copy link', copied: 'Copied', selectPlace: 'Select a place', searchPlace: 'Search by place, region, or address', noPlaceResult: 'No places found.',
    favoriteView: 'Saved places view', defaultView: 'Default view', groupByRegion: 'Group by region', unknownRegion: 'Other regions',
    courseNamePlaceholder: 'e.g. Seoul history and culture tour', descriptionPlaceholder: 'Add a short description of your itinerary', startDate: 'Start date', endDate: 'End date', savedCourses: 'Saved itineraries', noDescription: 'No description provided.',
    visitMemoPlaceholder: 'Leave a memory or useful tip', chooseRating: 'Select', visitHistory: 'Visit history'
  }
};

const nameOf = (favorite, lang) => favorite?.place?.location?.name?.[lang] || favorite?.place?.location?.name?.ko || '';
const placeNameOf = (place, lang) => place?.location?.name?.[lang] || place?.location?.name?.ko || '';
const regionOf = (favorite, lang, fallback) => favorite?.place?.location?.region?.[lang] || favorite?.place?.location?.region?.ko || fallback;
const keyOf = (item) => `${item.placeType}:${item.placeId}`;
const FAVORITE_REGION_ORDER = ['SEOUL', 'GGICN', 'GANGWON', 'CCDAEJEON', 'GSBUSANDAEGUULSAN', 'JRGWANGJU', 'JEJU', 'OTHER'];
const FAVORITE_REGION_LABELS = {
  SEOUL: { ko: '서울', en: 'Seoul' },
  GGICN: { ko: '경기도 / 인천', en: 'Gyeonggi / Incheon' },
  GANGWON: { ko: '강원도', en: 'Gangwon' },
  CCDAEJEON: { ko: '충청도', en: 'Chungcheong' },
  GSBUSANDAEGUULSAN: { ko: '경상도', en: 'Gyeongsang' },
  JRGWANGJU: { ko: '전라도', en: 'Jeolla' },
  JEJU: { ko: '제주도', en: 'Jeju Island' },
};

function FavoriteCard({ favorite, lang, labels, onRemove }) {
  const name = nameOf(favorite, lang);
  return (
    <article className="placeCard">
      <div className="placeCardImage">
        <img src={`${favorite.place?.img?.link}3.jpg`} alt={name} />
        <span className="placeCardRegion">{regionOf(favorite, lang, labels.unknownRegion)}</span>
      </div>
      <div className="placeCardBody">
        <h3>{name}</h3>
        <div className="placeCardActions">
          <Link to={placePath(favorite.placeType, favorite.placeId)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            {labels.open}
          </Link>
          <button type="button" onClick={() => onRemove(favorite)} aria-label={`${name} ${labels.remove}`} title={labels.remove}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/></svg>
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
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (type === 'favorites') {
    return (
      <svg {...commonProps}>
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
      </svg>
    );
  }

  if (type === 'courses') {
    return (
      <svg {...commonProps}>
        <path d="m10.586 5.414-5.172 5.172"/>
        <path d="m18.586 13.414-5.172 5.172"/>
        <path d="M6 12h12"/>
        <circle cx="12" cy="20" r="2"/>
        <circle cx="12" cy="4" r="2"/>
        <circle cx="20" cy="12" r="2"/>
        <circle cx="4" cy="12" r="2"/>
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M13 5h8"/>
      <path d="M13 12h8"/>
      <path d="M13 19h8"/>
      <path d="m3 17 2 2 4-4"/>
      <rect x="3" y="4" width="6" height="6" rx="1"/>
    </svg>
  );
}

function FavoriteMap({ favorites, lang, labels }) {
  useKakaoLoader();
  const markers = favorites.flatMap((favorite) => {
    const latLng = favorite.place?.location?.latLng;
    if (!latLng) return [];
    const [lat, lng] = latLng.split(',').map(Number);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [{ favorite, lat, lng }] : [];
  });
  if (!markers.length) return <div className="memberEmpty mapEmpty">{labels.noMap}</div>;
  const center = {
    lat: markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length,
    lng: markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length,
  };
  return (
    <KakaoMap className="favoriteMap" center={center} level={markers.length > 1 ? 12 : 4}>
      {markers.map(({ favorite, lat, lng }) => (
        <Fragment key={keyOf(favorite)}>
          <MapMarker position={{ lat, lng }} />
          <CustomOverlayMap position={{ lat, lng }} yAnchor={2.5}>
            <Link className="favoriteMapLabel" to={placePath(favorite.placeType, favorite.placeId)}>{nameOf(favorite, lang)}</Link>
          </CustomOverlayMap>
        </Fragment>
      ))}
    </KakaoMap>
  );
}

const MemberPage = ({ shared = false }) => {
  const { lang } = useLanguage();
  const labels = copy[lang === 'ko' ? 'ko' : 'en'];
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [favoriteView, setFavoriteView] = useState('default');
  const [isFavoriteViewOpen, setIsFavoriteViewOpen] = useState(false);
  const favoriteViewRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [visits, setVisits] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [visitForm, setVisitForm] = useState(emptyVisit);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [visitSearch, setVisitSearch] = useState('');
  const [isVisitSearchOpen, setIsVisitSearchOpen] = useState(false);
  const visitSearchRef = useRef(null);
  const [visitPlaces, setVisitPlaces] = useState([]);
  const [visitPlacesLoading, setVisitPlacesLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const auth = await memberApi('/auth/session');
      setSession(auth);
      if (shared && id) {
        const course = await memberApi(`/itineraries/${id}`);
        setCourses([course]);
        setTab('courses');
      } else if (auth.authenticated) {
        const [favoriteData, courseData, visitData] = await Promise.all([
          memberApi('/favorites'), memberApi('/itineraries/mine'), memberApi('/visits')
        ]);
        setFavorites(favoriteData);
        setCourses(courseData);
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

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!isFavoriteViewOpen) return;
    const closeFavoriteView = (event) => {
      if (event.type === 'mousedown' && favoriteViewRef.current?.contains(event.target)) return;
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      setIsFavoriteViewOpen(false);
    };
    document.addEventListener('mousedown', closeFavoriteView);
    document.addEventListener('keydown', closeFavoriteView);
    return () => {
      document.removeEventListener('mousedown', closeFavoriteView);
      document.removeEventListener('keydown', closeFavoriteView);
    };
  }, [isFavoriteViewOpen]);

  useEffect(() => {
    if (!isVisitSearchOpen) return;
    const closeVisitSearch = (event) => {
      if (event.type === 'mousedown' && visitSearchRef.current?.contains(event.target)) return;
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      setIsVisitSearchOpen(false);
    };
    document.addEventListener('mousedown', closeVisitSearch);
    document.addEventListener('keydown', closeVisitSearch);
    return () => {
      document.removeEventListener('mousedown', closeVisitSearch);
      document.removeEventListener('keydown', closeVisitSearch);
    };
  }, [isVisitSearchOpen]);

  useEffect(() => {
    if (!session?.authenticated || tab !== 'visits' || shared) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setVisitPlacesLoading(true);
      try {
        const places = await memberApi(`/places/search?q=${encodeURIComponent(visitSearch)}`);
        if (active) setVisitPlaces(places);
      } catch {
        if (active) setVisitPlaces([]);
      } finally {
        if (active) setVisitPlacesLoading(false);
      }
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [session?.authenticated, shared, tab, visitSearch]);

  const favoriteMap = useMemo(() => new Map(favorites.map((item) => [keyOf(item), item])), [favorites]);
  const favoriteGroups = useMemo(() => {
    if (favoriteView === 'default') return [{ region: '', items: favorites }];
    const groups = favorites.reduce((result, favorite) => {
      const regionCode = favorite?.place?.location?.region?.code || 'OTHER';
      const groupCode = FAVORITE_REGION_LABELS[regionCode] ? regionCode : 'OTHER';
      if (!result.has(groupCode)) result.set(groupCode, []);
      result.get(groupCode).push(favorite);
      return result;
    }, new Map());
    return FAVORITE_REGION_ORDER
      .filter((code) => groups.has(code))
      .map((code) => ({
        region: FAVORITE_REGION_LABELS[code]?.[lang === 'ko' ? 'ko' : 'en'] || labels.unknownRegion,
        items: groups.get(code),
      }));
  }, [favoriteView, favorites, lang, labels.unknownRegion]);

  const removeFavorite = async (favorite) => {
    await memberApi(`/favorites/${favorite.placeType}/${favorite.placeId}`, { method: 'DELETE' });
    setFavorites((items) => items.filter((item) => keyOf(item) !== keyOf(favorite)));
  };

  const submitCourse = async (event) => {
    event.preventDefault(); setError('');
    const body = {
      title: courseForm.title, description: courseForm.description, visibility: courseForm.visibility,
      days: [{ date: courseForm.date || null, title: '', places: courseForm.selected.map((key, order) => {
        const [placeType, placeId] = key.split(':'); return { placeType, placeId: Number(placeId), order, memo: '' };
      }) }, ...(courseForm.endDate ? [{ date: courseForm.endDate, title: '', places: [] }] : [])]
    };
    try {
      if (editingCourse) await memberApi(`/itineraries/${editingCourse}`, { method: 'PATCH', body });
      else await memberApi('/itineraries', { method: 'POST', body });
      setCourseForm(emptyCourse); setEditingCourse(null); await load(); setTab('courses');
    } catch { setError(labels.saveError); }
  };

  const editCourse = (course) => {
    const day = course.days?.[0];
    setCourseForm({ title: course.title, description: course.description || '', visibility: course.visibility,
      date: day?.date ? day.date.slice(0, 10) : '', endDate: course.days?.[1]?.date ? course.days[1].date.slice(0, 10) : '',
      selected: (course.days || []).flatMap((courseDay) => courseDay.places || []).map(keyOf) });
    setEditingCourse(course._id); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCourse = async (courseId) => {
    await memberApi(`/itineraries/${courseId}`, { method: 'DELETE' });
    setCourses((items) => items.filter((item) => item._id !== courseId));
  };

  const submitVisit = async (event) => {
    event.preventDefault(); setError('');
    const [placeType, placeId] = visitForm.placeKey.split(':');
    const body = { placeType, placeId: Number(placeId), visitedAt: visitForm.visitedAt,
      rating: visitForm.rating || null, memo: visitForm.memo };
    try {
      if (editingVisit) await memberApi(`/visits/${editingVisit}`, { method: 'PATCH', body });
      else await memberApi('/visits', { method: 'POST', body });
      setVisitForm(emptyVisit); setVisitSearch(''); setEditingVisit(null); await load(); setTab('visits');
    } catch { setError(labels.saveError); }
  };

  const editVisit = (visit) => {
    setVisitForm({ placeKey: keyOf(visit), visitedAt: visit.visitedAt.slice(0, 10), rating: visit.rating || '', memo: visit.memo || '' });
    setVisitSearch(nameOf(visit, lang));
    setEditingVisit(visit._id); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareCourse = async (courseId) => {
    await navigator.clipboard.writeText(`${window.location.origin}/itineraries/${courseId}`);
    setCopied(courseId); window.setTimeout(() => setCopied(''), 1500);
  };

  const coursePlaceName = (place) => {
    const favorite = favoriteMap.get(keyOf(place));
    return nameOf(favorite, lang) || place.place?.location?.name?.[lang] || place.place?.location?.name?.ko || keyOf(place);
  };

  return (
    <>
      <Header/>
      <main className="memberPage">
        <section className="memberHero">
          <p className="preTitle14px600b54a2f">
              <span className="preTitle14px600b54a2fLine"></span>
              {labels.eyebrow}
          </p>
          <h2 className="title28px40px700">
              {labels.title}
          </h2>
          <p className='memberHeroSubtitle'>{labels.subtitle}</p>
        </section>
        {loading ? <div className="memberState">Loading...</div> 
        : error && !session ? <div className="memberState error">{error}</div>
        : !shared && !session?.authenticated ? 
          <div className="memberState">
            <h2>{labels.login}</h2>
            <p>{labels.loginHint}</p>
          </div>
        : <div className="memberLayout">
            {!shared && 
              <nav className="memberTabs">
                {[['favorites', labels.favorites], ['courses', labels.courses], ['visits', labels.visits]].map(([value, label]) =>
                <button type="button" key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>
                  <MemberTabIcon type={value} />
                  {label}
                </button>)}
              </nav>
            }
            {error && <p className="memberError" role="alert">{error}</p>}

            {tab === 'favorites' && 
              <section className="memberSection">
                <div className="memberSectionTitle">
                  <p className='memberSectionMainTitle'>{labels.favorites}</p>
                  <span>{favorites.length}</span>
                </div>
                <div className="memberSectionFavoritesMap">
                  <p className='memberSectionFavoritesMapTitle'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-icon lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
                    {labels.map}
                  </p>
                  <FavoriteMap favorites={favorites} lang={lang} labels={labels}/>
                </div>
                {!favorites.length ? 
                  <div className="memberEmpty">{labels.emptyFavorite}</div> 
                  : <div className="favoriteCollection">
                      <div className="favoriteViewControl" ref={favoriteViewRef}>
                        <span className="srOnly">{labels.favoriteView}</span>
                        <button type="button" className="favoriteViewTrigger" aria-haspopup="listbox" aria-expanded={isFavoriteViewOpen} onClick={() => setIsFavoriteViewOpen((isOpen) => !isOpen)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          <span>{favoriteView === 'region' ? labels.groupByRegion : labels.defaultView}</span>
                          <svg className={isFavoriteViewOpen ? 'open' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <div className={`favoriteViewMenu ${isFavoriteViewOpen ? 'open' : ''}`} role="listbox" aria-label={labels.favoriteView}>
                          {[['default', labels.defaultView], ['region', labels.groupByRegion]].map(([value, label]) => (
                            <button type="button" role="option" aria-selected={favoriteView === value} className={favoriteView === value ? 'selected' : ''} key={value} onClick={() => { setFavoriteView(value); setIsFavoriteViewOpen(false); }}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {favoriteGroups.map((group) => (
                        <section className="favoriteRegionGroup" key={group.region || 'all'}>
                          {group.region && 
                            <h3>{group.region}
                              {/* <span>{group.items.length}</span> */}
                            </h3>
                          }
                          <div className="placeGrid">
                            {group.items.map((favorite) => <FavoriteCard key={favorite._id} favorite={favorite} lang={lang} labels={labels} onRemove={removeFavorite} />)}
                          </div>
                        </section>
                      ))}
                    </div>}
                </section>}

        {tab === 'courses' && <section className="memberSection courseSection">
          {!shared && <form className="memberForm courseFormCard" onSubmit={submitCourse}>
            <div className="courseFormHeader">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v3m8-3v3M4 9h16M5 4h14a1 1 0 0 1 1 1v15H4V5a1 1 0 0 1 1-1Z"/></svg></span>
              <h2>{editingCourse ? labels.updateCourse : labels.createCourse}</h2>
            </div>
            <div className="courseFormBody">
              <div className="formRow">
                <label>{labels.titleLabel}<input required maxLength="100" placeholder={labels.courseNamePlaceholder} value={courseForm.title} onChange={(e) => setCourseForm({...courseForm,title:e.target.value})}/></label>
                <label>{labels.visibility}<select value={courseForm.visibility} onChange={(e) => setCourseForm({...courseForm,visibility:e.target.value})}>
                  <option value="private">{labels.private}</option><option value="unlisted">{labels.unlisted}</option><option value="public">{labels.public}</option>
                </select></label>
              </div>
              <label>{labels.description}<textarea maxLength="200" placeholder={labels.descriptionPlaceholder} value={courseForm.description} onChange={(e) => setCourseForm({...courseForm,description:e.target.value})}/><small className="courseCharCount">{courseForm.description.length}/200</small></label>
              <div className="formRow">
                <label>{labels.startDate}<input type="date" value={courseForm.date} onChange={(e) => setCourseForm({...courseForm,date:e.target.value})}/></label>
                <label>{labels.endDate}<input type="date" min={courseForm.date || undefined} value={courseForm.endDate} onChange={(e) => setCourseForm({...courseForm,endDate:e.target.value})}/></label>
              </div>
              <fieldset className="coursePlacePicker"><legend>{labels.places}</legend>
                {favorites.length ? favorites.map((favorite) => <label className="checkPlace" key={favorite._id}>
                  <span className="coursePlaceIdentity"><input type="checkbox" checked={courseForm.selected.includes(keyOf(favorite))} onChange={(e) => setCourseForm({...courseForm,selected:e.target.checked ? [...courseForm.selected,keyOf(favorite)] : courseForm.selected.filter((key)=>key!==keyOf(favorite))})}/><span><strong>{nameOf(favorite,lang)}</strong><small>{regionOf(favorite,lang,labels.unknownRegion)}</small></span></span>
                  <em>{regionOf(favorite,lang,labels.unknownRegion)}</em>
                </label>) : <p>{labels.emptyFavorite}</p>}
              </fieldset>
              <div className="formActions courseFormActions"><button className="primary" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 21v-7h8v7"/></svg>{editingCourse ? labels.updateCourse : labels.createCourse}</button>{editingCourse && <button type="button" onClick={() => {setEditingCourse(null);setCourseForm(emptyCourse)}}>{labels.cancel}</button>}</div>
            </div>
          </form>}
          <div className="savedCourseHeading"><h2>{labels.savedCourses}</h2><span>{courses.length}</span></div>
          {!courses.length ? <div className="memberEmpty">{labels.emptyCourse}</div> : <div className="courseCardGrid">{courses.map((course) => {
            const allPlaces = (course.days || []).flatMap((day) => day.places || []);
            const cover = allPlaces.find((place) => place.place?.img?.link);
            const datedDays = (course.days || []).filter((day) => day.date);
            return <article key={course._id} className="savedCourseCard">
              <div className="savedCourseImage">{cover ? <img src={`${cover.place.img.link}1.jpg`} alt=""/> : <div className="courseImageFallback"/>}
                <span className={`visibility ${course.visibility}`}>{labels[course.visibility]}</span>
                {!shared && <button type="button" className="courseDelete" onClick={() => deleteCourse(course._id)} aria-label={labels.remove} title={labels.remove}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/></svg></button>}
              </div>
              <div className="savedCourseBody"><h3>{course.title}</h3><p>{course.description || labels.noDescription}</p>
                {datedDays.length > 0 && <time>{datedDays.map((day) => new Date(day.date).toLocaleDateString(lang)).join(' ~ ')}</time>}
                <div className="courseTags"><span>{lang === 'ko' ? `장소 ${allPlaces.length}개` : `${allPlaces.length} ${allPlaces.length === 1 ? 'place' : 'places'}`}</span></div>
                <div className="courseCardActions">{!shared && <button type="button" onClick={() => editCourse(course)}>{labels.edit}</button>}{course.visibility !== 'private' && <button type="button" onClick={() => shareCourse(course._id)}>{copied===course._id?labels.copied:labels.share}</button>}</div>
              </div>
            </article>})}</div>}
        </section>}

        {tab === 'visits' && <section className="memberSection visitSection">
          <form className="memberForm visitFormCard" onSubmit={submitVisit}>
            <div className="visitFormHeader"><span><MemberTabIcon type="visits" /></span><h2>{editingVisit ? labels.updateVisit : labels.createVisit}</h2></div>
            <div className="visitFormBody">
              <div className={`visitPlacePicker ${isVisitSearchOpen ? 'open' : ''}`} ref={visitSearchRef}>
                <label>{labels.place}<span className="visitSearchInput"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" autoComplete="off" placeholder={labels.searchPlace} value={visitSearch} onFocus={() => setIsVisitSearchOpen(true)} onChange={(e) => { setVisitSearch(e.target.value); setIsVisitSearchOpen(true); }}/></span></label>
                {isVisitSearchOpen && <div className="visitPlaceResults" role="listbox" aria-label={labels.selectPlace}>
                  {visitPlacesLoading ? <p>Loading...</p> : visitPlaces.length ? visitPlaces.map((place) => <button type="button" role="option" aria-selected={visitForm.placeKey === keyOf(place)} className={visitForm.placeKey === keyOf(place) ? 'selected' : ''} key={keyOf(place)} onClick={() => { setVisitForm({...visitForm,placeKey:keyOf(place)}); setVisitSearch(placeNameOf(place,lang)); setIsVisitSearchOpen(false); }}>
                    <span><strong>{placeNameOf(place,lang)}</strong><small>{place.location?.region?.[lang] || place.location?.region?.ko}</small></span><em>{place.placeType}</em>
                  </button>) : <p>{labels.noPlaceResult}</p>}
                </div>}
              </div>
              <div className="formRow visitMetaRow"><label>{labels.visitDate}<input required type="date" value={visitForm.visitedAt} onChange={(e)=>setVisitForm({...visitForm,visitedAt:e.target.value})}/></label>
                <fieldset className="ratingPicker"><legend>{labels.rating}</legend><div>{[1,2,3,4,5].map((number) => <button type="button" key={number} className={Number(visitForm.rating) >= number ? 'selected' : ''} onClick={() => setVisitForm({...visitForm,rating:String(number)})} aria-label={`${number} / 5`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z"/></svg></button>)}<span>{visitForm.rating || labels.chooseRating}</span></div></fieldset>
              </div>
              <label className="visitMemo">{labels.memo}<textarea maxLength="500" placeholder={labels.visitMemoPlaceholder} value={visitForm.memo} onChange={(e)=>setVisitForm({...visitForm,memo:e.target.value})}/><small>{visitForm.memo.length}/500</small></label>
              <div className="formActions visitFormActions"><button className="primary" type="submit" disabled={!visitForm.placeKey}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h12l2 2v16H5V3Zm3 0v6h8V3M8 21v-7h8v7"/></svg>{editingVisit?labels.updateVisit:labels.createVisit}</button>{editingVisit&&<button type="button" onClick={()=>{setEditingVisit(null);setVisitForm(emptyVisit);setVisitSearch('')}}>{labels.cancel}</button>}</div>
            </div>
          </form>
          <div className="savedCourseHeading"><h2>{labels.visitHistory}</h2><span>{visits.length}</span></div>
          {!visits.length ? <div className="memberEmpty">{labels.emptyVisit}</div> : <div className="visitRecordList">{visits.map((visit)=><article className="visitRecordCard" key={visit._id}>
            <img src={`${visit.place?.img?.link}1.jpg`} alt=""/><div className="visitRecordBody"><h3>{nameOf(visit,lang)}</h3><div className="visitRecordMeta"><span>⌖ {visit.place?.location?.region?.[lang] || visit.place?.location?.region?.ko}</span><time>▣ {new Date(visit.visitedAt).toLocaleDateString(lang)}</time></div>{visit.rating&&<div className="visitRecordRating">{'★'.repeat(visit.rating)}<span>{'★'.repeat(5-visit.rating)}</span></div>}<p>{visit.memo}</p></div>
            <div className="visitRecordActions"><button type="button" className="visitEdit" onClick={()=>editVisit(visit)}>{labels.edit}</button><button type="button" className="visitDelete" onClick={async()=>{await memberApi(`/visits/${visit._id}`,{method:'DELETE'});setVisits(items=>items.filter(item=>item._id!==visit._id))}} aria-label={labels.remove} title={labels.remove}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/></svg></button></div>
          </article>)}</div>}
        </section>}
      </div>}
      </main>
      <Footer/>
    </>
  );
};

export default MemberPage;
