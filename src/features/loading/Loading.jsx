import React from 'react'

// Page Css
import './Loading.style.css'

const Loading = ({ variant = 'page', text }) => {
  return (
    <div className={`loaderWrap loaderWrap--${variant}`}>
      <div className="loader" aria-hidden="true"></div>
      {text && <p className="loaderText">{text}</p>}
    </div>
  )
}

export default Loading
