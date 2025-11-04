import React,{useState, useEffect} from 'react'

import { Link } from 'react-router-dom'

const TopfiveComponent = ({item}) => {
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
          <Link to={`/location/${item?.id}`}>
            <img src={isMobile?item?.top === 1?item?.imgName+"0M.jpg":item?.imgName+"1.jpg"
              :isZFold?item?.top === 1?item?.imgName+"0Z.jpg":item?.imgName+"1.jpg"
              :isTablet?item?.top === 1?item?.imgName+"0T.jpg":item?.imgName+"1.jpg"
              :item?.top === 1?item?.imgName+"0.jpg":item?.imgName+"1.jpg"
            } alt={item?.imgName+"1.jpg"} />
            <span className='topRanking'>
                TOP {item?.top}
            </span>
            <p>{item?.location}</p>
          </Link>
        </div>
  )
}

export default TopfiveComponent