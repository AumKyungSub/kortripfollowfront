import React from 'react'
import { useNavigate } from 'react-router-dom'

// Page css
import './Footer.style.css'

const Footer = () => {

  const navigate = useNavigate();

  const goToAbout=()=>{
    navigate('/about');
  }

  return (
    <div>
      <footer>
        <div className='footerCover'>
          <div className='footerLinkCover'>
            <a onClick={goToAbout}>사이트 소개</a> | 
            <a href='https://blog.naver.com/tripinsouthkorea' target="_blank" rel="noopener noreferrer">
              Blog
            </a> | 
            <a href='https://www.instagram.com/kayaum_photo/' target="_blank" rel="noopener noreferrer">
              Insta
            </a>
          </div>
          <p className='warnings'>
            모든 사진은 직접 찍은 사진으로 저작권을 가지고 있습니다.
          </p>
          <p className='footerEmail'>
            이메일: qnzldmad91@gmail.com
          </p>
          <p className='footerCopyRight'>
            COPYRIGHT&copy; 2025 By Aum Kyung Sub.<br/> All RIGHT's RESERVED
          </p>
        </div>
      </footer> 
    </div>
  )
}

export default Footer
