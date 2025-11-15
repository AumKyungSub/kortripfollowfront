import React, { useState, useEffect } from 'react'

// Page css
import './ThemeCategory.style.css'

const ThemeCategory = ({selectedTheme, setSelectedTheme}) => {
    const [fixed, setFixed] = useState(false);
    const theme = ["카페", "맛집"];
    
      useEffect(() => {    
        const handleScroll = () => {    
          // 헤더 높이 기준으로 스크롤 체크 (51px)
          const headerHeight = 51;
          if (window.scrollY >= headerHeight) {
            setFixed(true);
          } else {
            setFixed(false);
          }
        };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
  return (
    <>
        <div className={`themeCategoryCover ${fixed ? 'fixed' : ''}`}>
            <ul className="themeCategoryUl">
              {theme.map((reg)=>(
                <li
                  className={`themeCategoryLi ${selectedTheme === reg ? "active" : ""}`}
                  key={reg}
                  onClick={()=>setSelectedTheme(reg)}
                >
                  {reg}
                </li>
              ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
      
    </>
  )
}

export default ThemeCategory
