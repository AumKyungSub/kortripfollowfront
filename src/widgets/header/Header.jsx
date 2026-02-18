import React from 'react'
/*------------------------hooks-----------------------------------*/
// Navigate, Location
import { useNavigate, useLocation } from 'react-router-dom'
// Transition Language
import { useTranslation } from 'react-i18next'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'
/*------------------------/custom hooks-----------------------------------*/

// Page css
import './Header.style.css'

const Header = () => {
  const {
          isFullMobile /* maxWidth: 767 */
  } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // 언어 변경 함수
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // path로 경로 설정
  const goTo = (path) => () => navigate(path)

  // 각페이지와 디테일 페이지 연결
  const isActive = (path, startsWith) =>
    location.pathname === path ||
    (startsWith && location.pathname.startsWith(startsWith))

  // li 설정
  const gnbList = [
    { key: 'home', path: '/', label: t('menu.home') },
    { key: 'region', path: '/region', startsWith: '/location', label: t('menu.region') },
    { key: 'season', path: '/season', label: t('menu.season') },
    { key: 'theme', path: '/theme', startsWith: '/themeDetail', label: t('menu.theme') },
    { key: 'about', path: '/about', label: t('menu.about') },
  ]
  
  return (
    <header>
      <div className="headerCover">
        <div className="logo" onClick={goTo("/")}>
          <img src="/images/logo/logoIcon.png" alt="logoIcon" />
          <img src="/images/logo/logoText.png" alt="logoText" />
        </div>
        {!isFullMobile 
        &&
          <nav className="gnbPc">
            <ul>
              {gnbList.map(({ key, path, startsWith, label }) => (
                <li
                  key={key}
                  className={`gnbPcLi ${isActive(path, startsWith) ? 'active' : ''}`}
                  onClick={goTo(path)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </nav>
        }
        <div className='search'>
          {/* <img src="/images/icon/searchIcon.png" alt="search" /> 검색기능 추가 후 오픈 */}
          {/* <img src="/images/icon/aboutIcon.png" alt="icon" onClick={goToAbout}/> */}
          
          <button
            className={lang === "ko" ? "active" : ""} 
            onClick={() => changeLanguage("ko")}>
            한국어
          </button>
          <button
            className={lang === "en" ? "active" : ""} 
            onClick={() => changeLanguage("en")}>
            ENGLISH
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
