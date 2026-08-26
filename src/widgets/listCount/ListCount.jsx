import React from "react";

import { useResponsive } from "@/shared/hooks/useResponsive";
import { useTranslation } from "react-i18next";

//Page Css
import "./ListCount.style.css";

const ListCount = ({ preTitle, title, countText, children }) => {
  const { isFullMobile } = useResponsive();
  const { t } = useTranslation();

  return (
    <div className="listTitleCover">
      <div className="listCountTitleCover">
        <p className="preTitle14px600b54a2f">
          <span className="preTitle14px600b54a2fLine"></span>
          {preTitle}
        </p>
        <h2 className="title28px40px700 marginBottomZero">{title}</h2>
      </div>
      <div className="listCountMeta">
        <p className="subFont">
          {t("listCount.listContTotal")} {countText}
        </p>
        {children}
      </div>
    </div>
  );
};

export default ListCount;
