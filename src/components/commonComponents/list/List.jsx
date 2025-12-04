import React from 'react'
import { useNavigate } from 'react-router-dom'

// Page CSS
import './List.style.css'

const List = ({filteredList, link, selectedTheme}) => {
    const navigate = useNavigate();

    const handleClick = (data) => {
        navigate(`/${link}/${data?.id}`, {
            state: { 
                type: selectedTheme === "카페" 
                ? "cafes" 
                : selectedTheme === "맛집"
                ? "restaurants"
                : selectedTheme === "숙소"
                ?"lodgings"
                :"foods"
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
                            {data?.location?.region?.[0]}
                        </p>
                        <h3 className="listLocation">
                            {data?.location?.name}
                            {data?.description?.star && " "+data?.description?.star+"성"}
                        </h3>
                        <p className="listText">{data?.description?.title}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default List