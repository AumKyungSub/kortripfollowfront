import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
import EmptyHeader from '../commonComponents/emptyHeader/EmptyHeader'
import Footer from '../footer/Footer'
import MainImage from './components/mainImage/MainImage'
import Explain from './components/explain/Explain'
import Parking from './components/parking/Parking'
import LocInfo from './components/locationInfo/LocInfo'
import LocInfoNotPc from './components/locationInfo/LocInfoNotPc'
import Recommend from './components/recommend/Recommend'

// Page CSS
import './Location.style.css'

const Location = () => {
    const { id } = useParams();
    // minWidth: 1024
    const {isMobile, isTablet, isFullMobile, isDesktop} = useResponsive();
    // Data 불러오기
    const [data, setData] = useState([]);
    // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
    const [loading, setLoading] = useState(true);
    // 에러 상테 표시 (초기값: null => 에러 없음)
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = `${import.meta.env.VITE_API_URL}/rankings/${id}`;
        
                const response = await fetch(url);
                if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");

                const db = await response.json();
                setData(db);
            } catch (err) {
                console.error("데이터 에러", err);
                setError("데이터 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            {!isFullMobile && <Header/>}
            {!isFullMobile && <EmptyHeader/>}
            {data && <MainImage rankingData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>}
            {!isFullMobile ?
                <div className='locationDetailWholeCover'>
                    <div className="locationDetailLeftWholeCover">
                        <Explain rankingData={data} isFullMobile={isFullMobile} isDesktop={isDesktop} isTablet={isTablet}/>
                        <Parking rankingData={data}  isFullMobile={isFullMobile}/>
                        <Recommend rankingData={data} isFullMobile={isFullMobile}/>
                    </div>
                    <div className="locationDetailRightWholeCover">
                        <LocInfo rankingData={data} isFullMobile={isFullMobile}/>
                    </div>
                </div>
            :
                <div>
                    <Explain rankingData={data} isFullMobile={isFullMobile} />
                    <LocInfoNotPc rankingData={data} />
                    <Parking rankingData={data} isFullMobile={isFullMobile}/>
                    <Recommend rankingData={data} isFullMobile={isFullMobile}/>
                </div>
            
            }
            <Footer/>
        </div>
    )
}

export default Location
