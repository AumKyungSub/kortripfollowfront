import React from 'react'

// Components
import SeasonsComponent from './SeasonsComponent'

// Page CSS
import './Seasons.style.css'

const Seasons = () => {

  return (
    <div>
      <section className="seasons">
        <div className="cards">
          <SeasonsComponent imgName="mapIcon.png" name="지역별" function="/region"/>
          <SeasonsComponent imgName="seasonsIcon.png" name="계절별" function="/season"/>
          <SeasonsComponent imgName="cafeIcon.png" name="카페" function="/theme"/>
          <SeasonsComponent imgName="foodIcon.png" name="맛집" function="/theme"/>
        </div>
      </section>      
    </div>
  )
}

export default Seasons
