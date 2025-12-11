import React, {useState, useEffect, useRef} from 'react'

import { useTranslation } from 'react-i18next'

import './ListCategory.style.css'

const ListCategory = ({options, selected, setSelected, lang = "ko" , isFullMobile, useI18n = false }) => {
  const { t } = useTranslation();
  const [fixed, setFixed] = useState(false);
  const categoryRef = useRef(null);
  
    useEffect(() => {
      if (!isFullMobile) return;
  
      const handleScroll = () => {
        if (!categoryRef.current) return;
  
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
      }, [isFullMobile]);
      
  return (
    <>
      <div ref={categoryRef} className={`categoryCover ${fixed ? "fixed" : ""}`}>
        <ul className="categoryUl">
          {options.map((item) => (
            <li
              key={item.code}
              className={`categoryLi ${selected === item.code ? "active" : ""}`}
              onClick={() => setSelected(item.code)}
              style={!isFullMobile ? { width: `calc(100% / ${options.length})` } : {}}
            >
              {useI18n
                ? t(item.label)      // /location 같은 i18n 사용하는 경우
                : item.label[lang]}
                </li>
              ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
    </>
  )
}

export default ListCategory