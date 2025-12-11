import React from 'react'

// Page css
import './SeasonCategory.style.css'

const SeasonCategory = ({selected, setSelected, lang}) => {

  const seasonMap = {
    SPRING: { ko: "봄", en: "Spring" },
    SUMMER: { ko: "여름", en: "Summer" },
    FALL: { ko: "가을", en: "Fall" },
    WINTER: { ko: "겨울", en: "Winter" }
  };

  return (
    <div className='seasonCateWholeCover'>
      <div className='seasonCategoryCover'>
        <ul className="seasonCategoryUI">
          {Object.entries(seasonMap).map(([code, name]) => (
            <li
              key={code}
              className={`seasonCategoryLi ${selected === code ? 'active' : ''}`}
              onClick={() => setSelected(code)}
            >
              {name[lang]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SeasonCategory
