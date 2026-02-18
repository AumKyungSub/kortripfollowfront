import React from 'react'
import { useNavigate } from 'react-router-dom';    

const homeCategoryComponent = (props) => {
  const navigate = useNavigate();

  const goToNext = () => {
    navigate(props.path, { state: { selectedTheme: props.link } });
  };

  return (
    <div className="homeCategoryCard" onClick={goToNext}>
      <div className="homeCategoryImgCover">
        <img src={`/images/icon/${props.imgName}`} alt={props.imgName} />
      </div>
      <p className='subFont'>{props.name}</p>
    </div>
  )
}

export default homeCategoryComponent