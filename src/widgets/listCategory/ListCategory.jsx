import React, {useRef} from 'react'

import { useStickyCategory } from '@/shared/hooks/useStickyCategory';

import './ListCategory.style.css'

const ListCategory = ({options, selected, setSelected, isFullMobile }) => {
  const categoryRef = useRef(null);
  const fixed = useStickyCategory(isFullMobile);
      
  return (
    <>
      <div ref={categoryRef} className={`categoryCover ${fixed ? "fixed" : ""}`}>
        <ul className="categoryUl">
          {options.map((item) => (
            <li
              key={item.code}
              className={`categoryLi ${
                selected === item.code ? 'active' : ''
              }`}
              onClick={() => setSelected(item.code)}
              style={
                !isFullMobile
                  ? { width: `${100 / options.length}%` }
                  : undefined
              }
            >
              {item.label}
            </li>
          ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
    </>
  )
}

export default ListCategory