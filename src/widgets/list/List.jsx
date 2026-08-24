import React from 'react'

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom'
/*------------------------/hooks-----------------------------------*/

/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
import PlaceRating from '@/features/placeRating/PlaceRating';
import { placeImageUrl } from '@/shared/api/memberApi';
/*------------------------/custom hooks-----------------------------------*/

// Page CSS
import './List.style.css'

const List = ({ filteredList, link, selectedTheme }) => {
    // Transition Language
    const { t, lang, isEn } = useLanguage();

    // Navigate
    const navigate = useNavigate();
    const handleClick = (data) => {
        if (data?.source === "tourApi") {
            navigate(`/external-place/${data.id}`);
            return;
        }
        if (link === "location") {
            navigate(`/location/${data?.id}`);
            return;
        }

        if (link === "theme") {
            const category = selectedTheme?.toLowerCase();
            navigate(`/theme/${category}/${data?.id}`);
        }
    };

    return (
        <section className='listWrapper'>
            {filteredList.map((data) => (
                <div key={data.id} className='listCover'>
                    <div className="listImgCover">
                        <span className={`listVisitBadge ${data?.source === "tourApi" ? "beforeVisit" : "visited"}`}>
                            {data?.source === "tourApi"
                                ? (isEn ? "Not Visited Yet" : "방문 전")
                                : (isEn ? "Visited" : "직접 방문")}
                        </span>
                        <img className='listImg' src={placeImageUrl(data)} alt={data?.location?.name?.[lang]} />
                    </div>
                    <div className="listTextCover">
                        <p className="listName subFont">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b54a2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                            {data?.location?.region?.[lang]}
                        </p>
                        <div className="listTitleRow">
                            <h3 className="listLocation">
                                {data?.location?.name?.[lang]}
                                {data?.description?.star && ` ${data?.description?.star}${t("common.starUnit")}`}
                            </h3>
                            <PlaceRating summary={data.ratingSummary} />
                        </div>
                        <p className="listText">{data?.description?.slide?.[lang]}</p>
                        <div className="listGoTo" onClick={() => handleClick(data)}>
                            <p>{isEn ? t('button.readMore') : t('button.learnMore')}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default List
