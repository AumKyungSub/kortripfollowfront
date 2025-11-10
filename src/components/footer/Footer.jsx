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
        {/* 풋터 영역 추가 */}
          <h5>
            <a onClick={goToAbout}>사이트 소개</a> | 
            <a href='https://blog.naver.com/tripinsouthkorea' target="_blank" rel="noopener noreferrer">
              Blog
            </a> | 
            <a href='https://www.instagram.com/kayaum_photo/' target="_blank" rel="noopener noreferrer">
              Insta
            </a>
          </h5>
          <p className='warnings'>
            사이트에 있는 모든 실사진은 직접 찍은 사진으로 저작권을 가지고 있습니다.
          </p>
          <p>
            이메일: qnzldmad91@gmail.com
          </p>
          <p>
            COPYRIGHT&copy; 2025 By Aum Kyung Sub.<br/><br/> All RIGHT's RESERVED
          </p>
      </footer> 
    </div>
  )
}

export default Footer
