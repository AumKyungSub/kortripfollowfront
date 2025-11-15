import React,{useState, useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'
import { useLocation } from 'react-router-dom'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
import ThemeBanners from './components/themeBanner/ThemeBanners'
import ThemeCategory from './components/themeCategory/ThemeCategory'
import ThemeList from './components/themeList/ThemeList'
import Bottom from '../commonComponents/bottom/Bottom'
import Footer from '../footer/Footer'

// Page css
import './Theme.style.css'

const Theme = () => {
    // maxWidth: 479, maxWidth: 767, minWidth: 1024
    const {isMobile, isFullMobile, isDesktop} = useResponsive();
    // Location으로 불러오기
    const location = useLocation();
    const savedTheme = localStorage.getItem("selectedTheme");
    const navigationTheme = location.state?.selectedTheme;
    const initialTheme = location.state?.selectedTheme || savedTheme ||  '카페';
    const [selectedTheme, setSelectedTheme] = useState(initialTheme);
    
    useEffect(() => {
        localStorage.setItem("selectedTheme", selectedTheme);
    }, [selectedTheme]);

    useEffect(() => {
        if (navigationTheme) {
            // state는 딱 한 번 쓰고 버림!
            window.history.replaceState({}, "");
        }
    }, [navigationTheme]);
    
    const handleThemeChange = (value) => {
        setSelectedTheme(value);
        localStorage.setItem("selectedTheme", value);
    };

    // Data 불러오기
    const [data, setData] = useState({ dataC: [], dataR: [] });
    // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
    const [loading, setLoading] = useState(true);
    // 에러 상테 표시 (초기값: null => 에러 없음)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const urlS = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/cafes`;
            const urlR = `https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/restaurants`;

            const responseC = await fetch(urlC);
            const responseR = await fetch(urlR);

            const dataC = await responseC.json();
            const dataR = await responseR.json();

            setData({dataC, dataR});
        } catch (err) {
            console.error("데이터 에러", err);
            setError("데이터 불러오기 실패");
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    // 로딩 화면
    if (loading) return <div><Loading/></div>
    // 에러 화면
    if (error) return <div>{error}</div>
    // 데이터 없을때 화면
    if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;
    
    return (
        <>
            <Header/>
            {isDesktop && <ThemeBanners/>}
            <ThemeCategory selectedTheme={selectedTheme} setSelectedTheme={handleThemeChange}/>
            <ThemeList data={data} selectedTheme={selectedTheme}/>
            <Bottom 
                title={selectedTheme === "카페" ? "여행중 잠깐의 휴식" : "여행의 또 다른 재미"}
                text={selectedTheme === "카페" ? "따뜻한 향이 퍼지는 공간에서 잠시 숨을 고르면, 발걸음은 다시 가볍고 여행은 한층 더 깊어집니다. 어느 도시를 방문하든 감성과 분위기가 다른 카페들이 자리해 있어, 그곳에서의 휴식은 여행의 또 다른 즐거움이 되어줍니다." : "지역마다 고유의 식재료와 조리법이 녹아 있는 음식들은 그곳만의 이야기를 담고 있어, 한 입마다 새로운 경험을 선사합니다. 맛을 따라 걷는 순간들은 여행을 더욱 풍성하고 특별하게 만들어줍니다."}
                leftText={selectedTheme === "카페" ? "카페산" : "연사랑"}
                rightTitle={selectedTheme === "카페" ? "추천 음료" : "요리"}
                rightText={selectedTheme === "카페" ? "필터커피" : "한식"}
            />
            <Footer/>
        </>
    )
}

export default Theme
