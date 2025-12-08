import React, {useState,useEffect,useRef} from 'react'

import { useTranslation } from 'react-i18next';

// Page css
import './Category.style.css'

const Category = ({selected, setSelected, isFullMobile}) => {
  const { t } = useTranslation();
  const [fixed, setFixed] = useState(false);
  const categoryRef = useRef(null);

  // 전체를 초기값으로
  // const [selected, setSelected] = useState('전체');
  const regionOptions = [
    { code: "ALL", key: "homepage.homeRegion.regions.all" },
    { code: "SEOUL", key: "homepage.homeRegion.regions.seoul" },
    { code: "GGICN", key: "homepage.homeRegion.regions.ggIncheon" },
    { code: "GANGWON", key: "homepage.homeRegion.regions.gangwon" },
    { code: "CCDAEJEON", key: "homepage.homeRegion.regions.ccDaejeon" },
    { code: "GSBUSANDAEGUULSAN", key: "homepage.homeRegion.regions.gsBusanDaeguUlsan" },
    { code: "JRGWANGJU", key: "homepage.homeRegion.regions.jrGwangju" },
    { code: "JEJU", key: "homepage.homeRegion.regions.jeju" },
  ];

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
        <div ref={categoryRef} className={`categoryCover ${fixed ? 'fixed' : ''}`}>
            <ul className="categoryUl">
              {regionOptions.map((reg)=>(
                <li
                  key={reg.code}
                  className={`categoryLi ${selected === reg.code ? 'active':''}`}
                  onClick={()=>setSelected(reg.code)}
                >
                  {t(reg.key)}
                </li>
              ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
    </>
  )
}

export default Category
