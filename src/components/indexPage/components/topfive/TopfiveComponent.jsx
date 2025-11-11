import React from 'react'

import { Link } from 'react-router-dom'

const TopfiveComponent = ({rankingsTopFive, isMobile, isFullMobile, isDesktop}) => {

  return (
        <div className="card">
          <Link to={`/location/${rankingsTopFive?.id}`}>
            <img src={isMobile?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0M.jpg":rankingsTopFive?.img?.link+"1.jpg"
              :isFullMobile?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0Z.jpg":rankingsTopFive?.img?.link+"1.jpg"
              :!isDesktop?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0T.jpg":rankingsTopFive?.img?.link+"1.jpg"
              :rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0.jpg":rankingsTopFive?.img?.link+"1.jpg"
            } alt={rankingsTopFive?.img?.link+"1.jpg"} />
            <span className='topRanking'>
                TOP {rankingsTopFive?.top}
            </span>
            <p>{rankingsTopFive?.location?.name}</p>
          </Link>
        </div>
  )
}

export default TopfiveComponent