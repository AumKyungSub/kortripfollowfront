import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
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
    const {isMobile, isFullMobile, isDesktop} = useResponsive();
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
                const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings/${id}`;
        
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
            {data && <MainImage rankingData={data} isMobile={isMobile} isFullMobile={isFullMobile} isDesktop={isDesktop}/>}
            {data && <Explain rankingData={data} isDesktop={isDesktop} isFullMobile={isFullMobile}/>}
            {data && <Parking rankingData={data} />}

            {!isFullMobile? data && <LocInfo rankingData={data} />
            :  data && <LocInfoNotPc rankingData={data}/> 
            }
            {data && <Recommend rankingData={data} />}
            <Footer/>
        </div>
    )
}

export default Location
