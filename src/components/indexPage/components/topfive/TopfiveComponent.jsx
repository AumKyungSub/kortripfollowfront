import React,{useState, useEffect} from 'react'

import { Link } from 'react-router-dom'

const TopfiveComponent = ({rankingsTopFive}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 479);
    const [isZFold, setIsZFold] = useState(window.innerWidth <= 767);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1023);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 479);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsZFold(window.innerWidth <= 767);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsTablet(window.innerWidth <= 1023);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
        <div className="card">
          <Link to={`/location/${rankingsTopFive?.id}`}>
            <img src={isMobile?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0M.jpg":rankingsTopFive?.img?.link+"1.jpg"
              :isZFold?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0Z.jpg":rankingsTopFive?.img?.link+"1.jpg"
              :isTablet?rankingsTopFive?.top === 1?rankingsTopFive?.img?.link+"0T.jpg":rankingsTopFive?.img?.link+"1.jpg"
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