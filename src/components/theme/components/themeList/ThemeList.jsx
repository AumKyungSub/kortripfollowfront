import React from 'react'
import { useNavigate } from 'react-router-dom';

// Page css
import './ThemeList.style.css'

const ThemeList = ({data, selectedTheme}) => {
    const {dataC, dataR} = data;
    const navigate = useNavigate();
    // 데이터 수 확인
    const themeCount = selectedTheme === "카페" ? dataC.length : dataR.length;
console.log("dataC:", dataC);
    const handleClick = (item) => {
        navigate(`/themeDetail/${item.id}`, {
            state: { 
                type: selectedTheme === "카페" ? "cafes" : "restaurants"
            }
        });
    };

  return (
    <>
        <div className="themeListWholeCover">
            <div className="themeListTextCover">
                <h3 className='themeListH3'>추천 {selectedTheme} 리스트</h3>
                <p className='themeListP'>총 {themeCount}곳</p>
            </div>
            {selectedTheme === "카페" && 
                <div className="themeListAllCover">
                    {dataC.length > 0 ? (
                        dataC.map((list) => (
                            <div key={list.id} className='themeListCover' onClick={() => handleClick(list)}>
                                <div className="themeImgCover">
                                    <img src={list?.img?.link+"3R.jpg"} alt={list?.img?.link+"3R.jpg"} />
                                </div>
                                <div className="themeTextCover">
                                    <p className="themeName">
                                        <img src="/images/icon/regionIcon.png" alt="theme" />
                                        {list?.location?.region?.[0]}</p>
                                    <h3 className="themeLocation">{list?.location?.name}</h3>
                                    <p className="themeText">{list?.description?.title}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>카페 데이터가 없습니다.</div>
                    )}
                </div>}

            {selectedTheme === "맛집" && 
                <div className="themeListAllCover">
                    {dataR.length > 0 ? (
                        dataR.map((list) => (
                            <div key={list.id} className='themeListCover' onClick={() => handleClick(list)}>
                                <div className="themeImgCover">
                                    <img src={list?.img?.link+"3R.jpg"} alt={list?.img?.link+"3R.jpg"} />
                                </div>
                                <div className="themeTextCover">
                                    <p className="themeName">
                                        <img src="/images/icon/regionIcon.png" alt="theme" />
                                        {list?.location?.region?.[0]}</p>
                                    <h3 className="themeLocation">{list?.location?.name}</h3>
                                    <p className="themeText">{list?.description?.title}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>맛집 데이터가 없습니다.</div>
                    )}
                </div>}
        </div>
    </>
  )
}

export default ThemeList
