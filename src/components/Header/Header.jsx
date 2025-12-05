import React from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

// (hook) Get Navigate State
import { useNavigate, useLocation } from 'react-router-dom'

// Page css
import './Header.style.css'

const Header = () => {
  const {
          isFullMobile /* maxWidth: 767 */
        } = useResponsive();

  const location = useLocation();
  const navigate = useNavigate();
  
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
              <li className={`gnbPcLi ${location.pathname === '/' ? 'active' : ''}`} onClick={backToMain}>홈</li>
              <li className={`gnbPcLi ${location.pathname === '/region' ? 'active' : ''}`} onClick={goToRegion}>지역별</li>
              <li className={`gnbPcLi ${location.pathname === '/season' ? 'active' : ''}`} onClick={goToSeason}>계절별</li>
              <li className={`gnbPcLi ${location.pathname === '/theme' ? 'active' : ''}`} onClick={goToTheme}>테마별</li>
              <li className={`gnbPcLi ${location.pathname === '/about' ? 'active' : ''}`} onClick={goToAbout}>사이트 소개</li>
            </ul>
          </div>
        :
          <div className='search'>
            {/* <img src="/images/icon/searchIcon.png" alt="search" /> 검색기능 추가 후 오픈 */}
            <img src="/images/icon/aboutIcon.png" alt="icon" onClick={goToAbout}/>
          </div>
        }
      </div>
    </header>
  </div>
  )
}

export default Header
