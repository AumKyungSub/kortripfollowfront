import React from 'react'
import { useNavigate } from 'react-router-dom'

// Page css
import '../backArrow/BackArrow.style.css'

const HomeIcon = () => {
  const navigate = useNavigate();
  
  const backToMain=()=>{
    navigate('/');
  }
  
  return (
    <div className='backArrowCover' onClick={backToMain}>
        <img src="/images/icon/homeIcon.png" alt="homeIcon" className='backArrowImg'/>
    </div>
  )
}

export default HomeIcon
