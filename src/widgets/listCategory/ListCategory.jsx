import React, { useRef } from "react";

import "./ListCategory.style.css";

const ListCategory = ({
  options,
  selected,
  setSelected,
  isFullMobile,
  isSecondary = false,
}) => {
  const categoryRef = useRef(null);

  return (
    <>
      <div
        ref={categoryRef}
        className={`listCategoryCover ${isSecondary ? "listCategoryCover--secondary" : ""}`}
      >
        <ul
          className={`ListCategoryUl ${isSecondary ? "ListCategoryUl--secondary" : ""}`}
        >
          {options.map((item) => (
            <li
              key={item.code}
              className={`ListCategoryLi ${isSecondary ? "ListCategoryLi--secondary" : ""} ${
                selected === item.code ? "active" : ""
              }`}
              onClick={() => setSelected(item.code)}
              style={
                !isFullMobile && !isSecondary
                  ? { width: `${100 / options.length}%` }
                  : undefined
              }
            >
              <p>{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="emptyLine1px"></div>
    </>
  );
};

export default ListCategory;
