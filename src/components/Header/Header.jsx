import React from 'react'
import { useNavigate } from 'react-router-dom'

// Page css
import './Header.style.css'

const Header = () => {
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
  
  return (
  <div>
    <header className='header'>
      <div className="logo" onClick={backToMain}>
        <img src="/images/logo/logoIcon.png" alt="logoIcon" />
        <img src="/images/logo/logoText.png" alt="logoText" />
      </div>
      <div className="gnbPc">
        <ul>
          <li className="gnbPcLi" onClick={goToRegion}>지역별</li>
          <li className="gnbPcLi" onClick={goToSeason}>계절별</li>
          <li className="gnbPcLi" onClick={goToAbout}>사이트 소개</li>
        </ul>
      </div>
      <div className='search'>
        {/* <img src="/images/icon/searchIcon.png" alt="search" /> 검색기능 추가 후 오픈 */}
        <img src="/images/icon/aboutIcon.png" alt="icon" onClick={goToAbout}/>
      </div>
    </header>
  </div>
  )
}

export default Header
