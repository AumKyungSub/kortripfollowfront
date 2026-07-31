import React, {useState, useEffect} from 'react'
/*------------------------hooks-----------------------------------*/
// Navigate, Location
import { useNavigate, useLocation } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
// Language 
import { useLanguage } from '@/shared/hooks/useLanguage'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './Header.style.css'

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
          isFullMobile /* maxWidth: 767 */
  } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. 기본적으로 흰 배경(검은 글씨/로고)을 적용할 경로들의 시작 부분(prefix) 정의
  const LIGHT_HEADER_PATHS = [
    '/collection/',
    '/season'
  ];
  
  // 2. 현재 URL 경로가 LIGHT_HEADER_PATHS 중 하나로 시작하는지 체크
  const isLightPage = LIGHT_HEADER_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );
  
  // 3. 스크롤이 되었거나, 흰 배경 페이지일 때 검은색 로고/텍스트 상태로 전환
  const showDarkHeader = isLightPage || isScrolled;
  
  // Language Hook 사용
  const { lang, t, changeLanguage, isKo, isEn } = useLanguage();

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
    { key: 'season', path: '/season', label: t('menu.season'), icon: 'seasonsIcon' },
    { key: 'theme', path: '/theme', startsWith: '/themeDetail', label: t('menu.theme'), icon: 'travelIcon' },
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
    if (isMenuOpen) {
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
  }, [isMenuOpen]);
  
  return (
    <header className={showDarkHeader ? "scrolled" : ""}>
      <div className="headerCover">
        <div className="logo" onClick={goTo("/")}>
          <img src="/images/logo/logoIcon.png" alt="logoIcon" />
          <img src={getLogoImage()} alt="logoText" />
        </div>
        {!isFullMobile &&
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
              <button
                className={`
                  ${isKo ? 'active' : 'languageBtn'}${showDarkHeader ? 'Sc' : ''}
                `} 
                onClick={() => changeLanguage("ko")}>
                한국어
              </button>
              <button
                className={`
                  ${isEn ? 'active' : 'languageBtn'}${showDarkHeader ? 'Sc' : ''}
                `} 
                onClick={() => changeLanguage("en")}>
                ENGLISH
              </button>
            </>
          )}

          {isFullMobile && (
            <div className="mobileUtility">
                <button className="profileBtn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={showDarkHeader ? "#1a1a1a" : "#fafaf8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="searchInputWrapper">
              <img src="/images/icon/searchIcon.png" alt="search" className="searchIcon" />
              <input type="text" placeholder={t("header.search")} />
            </div>
            <div className="popularSearches">
              <p>
                {t("header.topSearchTitle")}
              </p>
              <div className="popularTags">
                {t("header.topSearchList1")}
                {/* <span>제주도</span>
                <span>부산 야경</span>
                <span>가을 단풍</span>
                <span>설악산</span>
                <span>경주 벚꽃</span> */}
              </div>
            </div>
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
    </header>
  )
}

export default Header
