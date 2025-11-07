import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

// Components
import Header from '../Header/Header'
import Footer from '../footer/Footer'
import MainImage from './components/mainImage/MainImage'
import Explain from './components/explain/Explain'
import Parking from './components/parking/Parking'
import Recommend from './components/recommend/Recommend'

// Page CSS
import './Location.style.css'

const Location = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings/${id}`;
        
                const response = await fetch(url);
                if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");

                const db = await response.json();
                setData(db);
            } catch (error) {
                console.error("❌ Data Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // 화면 크기 변경 시 모바일 여부 감지
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1023);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (loading) return <div>로딩중...</div>;
    if (!data) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            {!isMobile && <Header/>}
            {data && <MainImage rankingData={data} />}
            {data && <Explain rankingData={data} />}
            {data && <Parking rankingData={data} />}
            {data && <Recommend rankingData={data} />}
            <Footer/>
        </div>
    )
}

export default Location
