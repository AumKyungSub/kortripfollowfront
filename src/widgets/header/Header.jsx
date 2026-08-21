import React, {useState, useEffect, useRef} from 'react'
/*------------------------hooks-----------------------------------*/
// Navigate, Location
import { useNavigate, useLocation } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
import { API_URL } from '@/shared/config/apiUrl'
/*------------------------/custom hooks-----------------------------------*/

// Components
import SearchModal from '@/widgets/searchModal/SearchModal'
import LoginPage from '@/widgets/modalPage/loginPage/LoginPage'

// Page css
import './Header.style.css'

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const languageMenuRef = useRef(null);
  const apiUrl = API_URL;

  const {
          isFullMobile, /* maxWidth: 767 */
          isTablet, /* minWidth: 768, maxWidth: 1023 */
  } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. 기본적으로 흰 배경(검은 글씨/로고)을 적용할 경로들의 시작 부분(prefix) 정의
  const LIGHT_HEADER_PATHS = [
    '/collection/',
    '/season',
    '/privacy',
    '/terms',
    '/myTravel',
    '/itineraries/'
  ];
  
  // 2. 현재 URL 경로가 LIGHT_HEADER_PATHS 중 하나로 시작하는지 체크
  const isLightPage = LIGHT_HEADER_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );
  
  // 3. 스크롤이 되었거나, 흰 배경 페이지일 때 검은색 로고/텍스트 상태로 전환
  const showDarkHeader = isLightPage || isScrolled;
  
  // Language Hook 사용
  const { t, changeLanguage, isKo, isEn } = useLanguage();

  // path로 경로 설정
  const goTo = (path) => () => navigate(path)

  // 각페이지와 디테일 페이지 연결
  const isActive = (path, startsWith) =>
    location.pathname === path ||
    (startsWith && location.pathname.startsWith(startsWith))

  // return 문 안의 JSX 영역-------------------------
  // 헬퍼 모음 (추후 추가 및 수정 가능성 있음)
  // 1. 로고 텍스트 이미지 경로
  const getLogoImage = () => {
    if (isKo) {
      return showDarkHeader ? "/images/logo/logoTextSc.png" : "/images/logo/logoText.png";
    }
    return showDarkHeader ? "/images/logo/logoTextEnSc.png" : "/images/logo/logoTextEn.png";
  };

  // 2. li 리스트 설정
  const gnbList = [
    { key: 'home', path: '/', label: t('menu.home'), icon: 'homeIcon' },
    { key: 'region', path: '/region', startsWith: '/location', label: t('menu.region'), icon: 'regionIcon' },
    // { key: 'season', path: '/season', label: t('menu.season'), icon: 'seasonsIcon' },
    { key: 'theme', path: '/theme', startsWith: '/theme/', label: t('menu.theme'), icon: 'travelIcon' },
    { key: 'collection', path: '/collection', startsWith: '/collection', label: t('menu.collection'), icon: 'collectionIcon' },
    { key: 'about', path: '/about', label: t('menu.about'), icon: 'infoIcon' },
  ]
  // ----------------------------------------------

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // 처음 렌더링 시에도 실행
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 메뉴 열림 시 스크롤 방지 및 모바일 내비게이션 숨김
  useEffect(() => {
    if (isMenuOpen || isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen, isAuthModalOpen]);

  useEffect(() => {
    if (!isLanguageOpen) return;

    const closeLanguageMenu = (event) => {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'mousedown' && languageMenuRef.current?.contains(event.target)) return;
      setIsLanguageOpen(false);
    };

    document.addEventListener('mousedown', closeLanguageMenu);
    document.addEventListener('keydown', closeLanguageMenu);
    return () => {
      document.removeEventListener('mousedown', closeLanguageMenu);
      document.removeEventListener('keydown', closeLanguageMenu);
    };
  }, [isLanguageOpen]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/session`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Unable to load session');
        const data = await response.json();
        if (isMounted) setAuthUser(data.authenticated ? data.user : null);
      } catch {
        if (isMounted) setAuthUser(null);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    };

    loadSession();

    const params = new URLSearchParams(window.location.search);
    if (params.has('login')) {
      params.delete('login');
      const query = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
    }

    return () => { isMounted = false; };
  }, [apiUrl]);

  const selectLanguage = (language) => {
    changeLanguage(language);
    setIsLanguageOpen(false);
  };

  return (
    <header className={showDarkHeader ? "scrolled" : ""}>
      <div className="headerCover contentWidthException">
        <div className="logo" onClick={goTo("/")}>
          <img src="/images/logo/logoIcon.png" alt="logoIcon" />
          <img src={getLogoImage()} alt="logoText" />
        </div>
        {!isFullMobile && !isTablet &&
          <nav className="gnb">
            <ul className='gnbContainer'>
              {gnbList.map(({ key, path, startsWith, label }) => (
                <li
                  key={key}
                  className={`
                    ${showDarkHeader ? "gnbListSc" : "gnbList"}
                    ${isActive(path, startsWith) ? "active" : ""}
                  `}
                  onClick={goTo(path)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </nav>
        }
        <div className='utilityBar'>
          {!isFullMobile && (
            <>
              <button className={`desktopSearchBtn ${showDarkHeader ? 'dark' : ''}`} onClick={() => setIsSearchOpen(true)} aria-label={isKo ? '여행지 검색' : 'Search destinations'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search headerSearch"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
              </button>
              <button
                type="button"
                className={`desktopProfileBtn ${showDarkHeader ? 'dark' : ''} ${authUser ? 'authenticated' : ''}`}
                onClick={() => setIsAuthModalOpen(true)}
                aria-label={authUser ? authUser.displayName : t('header.login')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {authUser && <span className="profileStatusDot" aria-hidden="true" />}
              </button>
              <div className={`desktopLanguage ${showDarkHeader ? 'dark' : ''}`} ref={languageMenuRef}>
                <button
                  type="button"
                  className="desktopLanguageTrigger"
                  aria-haspopup="listbox"
                  aria-expanded={isLanguageOpen}
                  onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages-icon lucide-languages"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                  <span>{isKo ? '한국어' : 'ENG'}</span>
                  <svg className={isLanguageOpen ? 'open' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`desktopLanguageMenu ${isLanguageOpen ? 'open' : ''}`} role="listbox" aria-label={t('header.setLanguage')}>
                  <button type="button" role="option" aria-selected={isKo} className={isKo ? 'selected' : ''} onClick={() => selectLanguage('ko')}>한국어</button>
                  <button type="button" role="option" aria-selected={isEn} className={isEn ? 'selected' : ''} onClick={() => selectLanguage('en')}>ENG</button>
                </div>
              </div>
            </>
          )}

          {isFullMobile && (
            <div className="mobileUtility">
                <button className="profileBtn" onClick={() => setIsAuthModalOpen(true)} aria-label={authUser ? authUser.displayName : t('header.login')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={showDarkHeader ? "#1a1a1a" : "#fafaf8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>
                <button className="hamburgerBtn" onClick={() => setIsMenuOpen(true)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={showDarkHeader ? "#1a1a1a" : "#fafaf8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
            </div>
          )}
        </div>
      </div>
      {isTablet &&
        <nav className="gnb">
          <ul className='gnbContainer'>
            {gnbList.map(({ key, path, startsWith, label }) => (
              <li
                key={key}
                className={`
                  ${showDarkHeader ? "gnbListSc" : "gnbList"}
                  ${isActive(path, startsWith) ? "active" : ""}
                `}
                onClick={goTo(path)}
              >
                {label}
              </li>
            ))}
          </ul>
        </nav>
      }

      {isAuthModalOpen && (
        <LoginPage
          authUser={authUser}
          isAuthLoading={isAuthLoading}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthUserChange={(user) => {
            setAuthUser(user)
            if (!user) setIsMenuOpen(false)
          }}
        />
      )}

      {/* Mobile Slide Menu */}
      <div className={`mobileMenuWrapper ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobileMenuOverlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="mobileMenuContent">
          <div className="mobileMenuHeader">
            <h2>
              {t("header.menu")}
            </h2>
            <button className="closeMenuBtn" onClick={() => setIsMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#262a36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mobileMenuSearch">
            <button type="button" className="searchInputWrapper" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
              <img src="/images/icon/searchIcon.png" alt="search" className="searchIcon" />
              <span>{isKo ? '여행지 이름이나 키워드를 검색하세요' : 'Search destinations or keywords'}</span>
            </button>
            {/* <div className="popularSearches">
              <p>
                {t("header.topSearchTitle")}
              </p>
              <div className="popularTags">
                {t("header.topSearchList1")}
                <span>제주도</span>
                <span>부산 야경</span>
                <span>가을 단풍</span>
                <span>설악산</span>
                <span>경주 벚꽃</span>
              </div>
            </div> */}
          </div>

          <div className="mobileMenuCategories">
            <p className="categoryTitle">
              {t("header.category")}
            </p>
            <ul>
              {gnbList.map(({ key, path, startsWith, label, icon }) => (
                <li
                  key={key}
                  className={isActive(path, startsWith) ? "active" : ""}
                  onClick={() => {
                    setIsMenuOpen(false);
                    goTo(path)();
                  }}
                >
                  <div className="menuItemLeft">
                    <div className="menuItemIcon">
                      <img src={`/images/header/icon/${icon}.png`} alt={label} />
                    </div>
                    <span>{label}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0a4b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </li>
              ))}
            </ul>
          </div>

          <div className="mobileMenuFooter">
            <p>
              {t('header.setLanguage')}
            </p>
            <div className="mobileLangToggle">
              <button className={isKo ? 'active' : ''} onClick={() => changeLanguage("ko")}>한국어</button>
              <button className={isEn ? 'active' : ''} onClick={() => changeLanguage("en")}>ENGLISH</button>
            </div>
          </div>
        </div>
      </div>
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </header>
  )
}

export default Header
