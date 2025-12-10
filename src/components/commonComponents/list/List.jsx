import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

// Page CSS
import './List.style.css'

const List = ({filteredList, link, selectedTheme}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

    const navigate = useNavigate();

    const handleClick = (data) => {
        navigate(`/${link}/${data?.id}`, {
            state: { 
            type: selectedTheme === "CAFE" 
            ? "cafes" 
            : selectedTheme === "RESTAURANT"
            ? "restaurants"
            : selectedTheme === "LODGING"
            ? "lodgings"
            : "foods"
            }
        });
    }

  return (
    <>
        <div className='listWholeCover'>
            {filteredList.map((data)=>(
                <div key={data.id} className='listCover' onClick={() => handleClick(data)}>
                    <div className="listImgCover">
                        <img src={data?.img?.link+"3R.jpg"} alt={data?.img?.link+"3R.jpg"} />
                    </div>
                    <div className="listTextCover">
                        <p className="listName">
                            <img src="/images/icon/regionIcon.png" alt="region" />
                            {data?.location?.region?.[lang]}
                        </p>
                        <h3 className="listLocation">
                            {data?.location?.name?.[lang]}
                            {data?.description?.star && ` ${data?.description?.star}${t("common.starUnit")}`}
                        </h3>
                        <p className="listText">{data?.description?.title?.[lang]}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default List