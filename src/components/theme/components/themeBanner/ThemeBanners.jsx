import React from 'react'

// Page css
import './ThemeBanners.style.css'

const ThemeBanners = () => {
    const getRandom = (min,max) => Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <div className='themeBannerWholeCover'>
        <section className='themeBannerCover'>
                <img src={`/images/theme/themeBanner${getRandom(1, 2)}.jpg`} alt="Banner Img" />
        </section>
    </div>
  )
}

export default ThemeBanners
