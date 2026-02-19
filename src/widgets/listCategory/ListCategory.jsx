import React, {useRef} from 'react'

import { useStickyCategory } from '@/shared/hooks/useStickyCategory';

import './ListCategory.style.css'

const ListCategory = ({options, selected, setSelected, isFullMobile }) => {
  const categoryRef = useRef(null);
  const fixed = useStickyCategory(isFullMobile);
      
  return (
    <>
      <div ref={categoryRef} className={`listCategoryCover ${fixed ? "fixed" : ""}`}>
        <ul className="ListCategoryUl">
          {options.map((item) => (
            <li
              key={item.code}
              className={`ListCategoryLi ${
                selected === item.code ? 'active' : ''
              }`}
              onClick={() => setSelected(item.code)}
              style={
                !isFullMobile
                  ? { width: `${100 / options.length}%` }
                  : undefined
              }
            >
              <p>
                {item.label}
              </p>
            </li>
          ))}
            </ul>
        </div>
        <div className="emptyLine1px"></div>
    </>
  )
}

export default ListCategory