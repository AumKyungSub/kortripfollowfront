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

  const {
          isFullMobile /* maxWidth: 767 */
  } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();

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
      return isScrolled ? "/images/logo/logoTextSc.png" : "/images/logo/logoText.png";
    }
    return isScrolled ? "/images/logo/logoTextEnSc.png" : "/images/logo/logoTextEn.png";
  };

  // 2. li 리스트 설정
  const gnbList = [
    { key: 'home', path: '/', label: t('menu.home') },
    { key: 'region', path: '/region', startsWith: '/location', label: t('menu.region') },
    { key: 'season', path: '/season', label: t('menu.season') },
    { key: 'theme', path: '/theme', startsWith: '/themeDetail', label: t('menu.theme') },
    { key: 'collection', path: '/collection', startsWith: '/collection', label: t('menu.collection') },
    { key: 'about', path: '/about', label: t('menu.about') },
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
  
  return (
    <header className={isScrolled ? "scrolled" : ""}>
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
                    ${isScrolled ? "gnbListSc" : "gnbList"}
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
          {/* <img src="/images/icon/searchIcon.png" alt="search" /> 검색기능 추가 후 오픈 */}
          {/* <img src="/images/icon/aboutIcon.png" alt="icon" onClick={goToAbout}/> */}
          
          <button
            className={`
              ${isKo ? 'active' : 'languageBtn'}${isScrolled ? 'Sc' : ''}
            `} 
            onClick={() => changeLanguage("ko")}>
            한국어
          </button>
          <button
            className={`
              ${isEn ? 'active' : 'languageBtn'}${isScrolled ? 'Sc' : ''}
            `} 
            onClick={() => changeLanguage("en")}>
            ENGLISH
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
