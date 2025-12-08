import React, { useState, useEffect } from 'react'

// Page css
import './ThemeCategory.style.css'

const themeMap = {
  CAFE: { ko: "카페", en: "Cafe" },
  RESTAURANT: { ko: "맛집", en: "Restaurant" },
  LODGING: { ko: "숙소", en: "Lodging" },
  FOOD: { ko: "먹거리", en: "Food" }
};


const ThemeCategory = ({selectedTheme, setSelectedTheme, lang}) => {

    const [fixed, setFixed] = useState(false);
    
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
              {Object.entries(themeMap).map(([code, label]) => (
                <li
                  key={code}
                  className={`themeCategoryLi ${selectedTheme === code ? "active" : ""}`}
                  onClick={() => setSelectedTheme(code)}
                >
                  {label[lang]}
                </li>
              ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
      
    </>
  )
}

export default ThemeCategory
