import React from 'react'
// (hook) Device Size
import { useResponsive } from '@/shared/hooks/useResponsive'

// (hook) Get Navigate State
import { useNavigate, useLocation } from 'react-router-dom'

// i18n -> Transition Language
import { useTranslation } from 'react-i18next'

// Page css
import './Header.style.css'

const Header = () => {
  const {
          isFullMobile /* maxWidth: 767 */
        } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  // 언어 변경 함수
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };
  
  const backToMain=()=>{
    navigate('/');
  }

  const goToAbout=()=>{
    navigate('/about');
  }

  const goToRegion=()=>{
    navigate('/region');
  }

  const goToSeason=()=>{
    navigate('/season');
  }

  const goToTheme=()=>{
    navigate('/theme');
  }
  
  return (
  <div>
    <header className='header'>
      <div className="headerCover">
        <div className="logo" onClick={backToMain}>
          <img src="/images/logo/logoIcon.png" alt="logoIcon" />
          <img src="/images/logo/logoText.png" alt="logoText" />
        </div>
        {!isFullMobile 
        ? 
          <div className="gnbPc">
            <ul>
              <li className={`gnbPcLi ${location.pathname === '/' ? 'active' : ''}`} onClick={backToMain}>{t("menu.home")}</li>
              <li className={`gnbPcLi ${location.pathname === '/region' ? 'active' : ''}`} onClick={goToRegion}>{t("menu.region")}</li>
              <li className={`gnbPcLi ${location.pathname === '/season' ? 'active' : ''}`} onClick={goToSeason}>{t("menu.season")}</li>
              <li className={`gnbPcLi ${location.pathname === '/theme' ? 'active' : ''}`} onClick={goToTheme}>{t("menu.theme")}</li>
              <li className={`gnbPcLi ${location.pathname === '/about' ? 'active' : ''}`} onClick={goToAbout}>{t("menu.about")}</li>
            </ul>
            <p>|</p>
            {/* 언어 버튼 (PC) */}
            <div className="langButtons">
              <button
                className={i18n.language === "ko" ? "active" : ""} 
                onClick={() => changeLanguage("ko")}>
                한국어
              </button>
              <button
                className={i18n.language === "en" ? "active" : ""} 
                onClick={() => changeLanguage("en")}>
                ENGLISH
              </button>
            </div>
          </div>
        :
          <div className='search'>
            {/* <img src="/images/icon/searchIcon.png" alt="search" /> 검색기능 추가 후 오픈 */}
            {/* <img src="/images/icon/aboutIcon.png" alt="icon" onClick={goToAbout}/> */}
            
            {/* 모바일: 토글 방식 */}
            <div className="langButtons">
              <button
                className={i18n.language === "ko" ? "active" : ""} 
                onClick={() => changeLanguage("ko")}>
                한국어
              </button>
              <button
                className={i18n.language === "en" ? "active" : ""} 
                onClick={() => changeLanguage("en")}>
                ENGLISH
              </button>
            </div>
          </div>
        }
      </div>
    </header>
  </div>
  )
}

export default Header
