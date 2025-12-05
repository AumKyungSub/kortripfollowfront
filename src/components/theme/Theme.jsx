import React,{useState, useEffect} from 'react'
// (hook) Device Size
import { useResponsive } from '../../hooks/ResponsiveUsed'
import { useLocation } from 'react-router-dom'

//Function Component
import Loading from '../functionComponents/Loading'

// Components
import Header from '../Header/Header'
import EmptyHeader from '../commonComponents/emptyHeader/EmptyHeader'
import ThemeBanners from './components/themeBanner/ThemeBanners'
import ThemeCategory from './components/themeCategory/ThemeCategory'
import ListCount from '../commonComponents/listCount/ListCount'
import List from '../commonComponents/list/List'
import Bottom from '../commonComponents/bottom/Bottom'
import Footer from '../footer/Footer'

// Page css
import './Theme.style.css'

const Theme = () => {
    // maxWidth: 479, maxWidth: 767, minWidth: 1024
    const {isFullMobile, isDesktop} = useResponsive();
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
    const [data, setData] = useState({ dataC: [], dataR: [], dataL: [], dataF: [] });
    // 로딩 상태 추가 (초기값: true => 데이터 요청 중)
    const [loading, setLoading] = useState(true);
    // 에러 상테 표시 (초기값: null => 에러 없음)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const urlC = `${import.meta.env.VITE_API_URL}/cafes`;
            const urlR = `${import.meta.env.VITE_API_URL}/restaurants`;
            const urlL = `${import.meta.env.VITE_API_URL}/lodgings`;
            const urlF = `${import.meta.env.VITE_API_URL}/foods`;

            const responseC = await fetch(urlC);
            const responseR = await fetch(urlR);
            const responseL = await fetch(urlL);
            const responseF = await fetch(urlF);

            const dataC = await responseC.json();
            const dataR = await responseR.json();
            const dataL = await responseL.json();
            const dataF = await responseF.json();

            setData({dataC, dataR, dataL, dataF});
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

    const filteredList = selectedTheme === "카페" 
                        ? data.dataC 
                        : selectedTheme === "맛집" 
                        ? data.dataR
                        : selectedTheme === "숙소"
                        ? data.dataL
                        : data.dataF;
    // 이/가 구분을 위한 변수
    const themePost = selectedTheme === "카페" 
    ? "카페가" 
    : selectedTheme === "맛집"
    ? "맛집이"
    : selectedTheme === "숙소"
    ? "숙소가"
    : "먹거리가";

    return (
        <>
            <Header/>
            {!isFullMobile && <EmptyHeader/>}
            {isDesktop && <ThemeBanners/>}
            <ThemeCategory selectedTheme={selectedTheme} setSelectedTheme={handleThemeChange}/>
            <ListCount title={`추천 ${selectedTheme} 리스트`} count={`등록된 ${themePost} 총 ${filteredList.length}`} countM={filteredList.length} isFullMobile={isFullMobile}/>
            <List filteredList={filteredList} link="themeDetail" selectedTheme={selectedTheme}/>
            <Bottom 
                title={selectedTheme === "카페" 
                        ? "여행 중 잠깐의 휴식"
                        :selectedTheme === "맛집" 
                        ? "여행의 또 다른 재미"
                        :selectedTheme === "숙소"
                        ? "여행의 연장을 위한 충전"
                        :"여행 중 에너지 충전"
                    }
                text={selectedTheme === "카페" 
                        ? "따뜻한 향이 퍼지는 공간에서 잠시 숨을 고르면, 발걸음은 다시 가볍고 여행은 한층 더 깊어집니다. 어느 도시를 방문하든 감성과 분위기가 다른 카페들이 자리해 있어, 그곳에서의 휴식은 여행의 또 다른 즐거움이 되어줍니다."
                        : selectedTheme === "맛집" 
                        ? "지역마다 고유의 식재료와 조리법이 녹아 있는 음식들은 그곳만의 이야기를 담고 있어, 한 입마다 새로운 경험을 선사합니다. 맛을 따라 걷는 순간들은 여행을 더욱 풍성하고 특별하게 만들어줍니다."
                        : selectedTheme === "숙소"
                        ? "여행의 끝에서 맞이하는 조용한 휴식의 순간, 편안한 숙소는 몸과 마음을 천천히 내려놓게 합니다. 낯선 도시의 밤공기와 어우러진 아늑한 공간에서 머무는 시간은 다시 여행을 시작할 힘을 채워줍니다."
                        : "여행길에서 만나는 작은 간식 하나가 뜻밖의 추억이 됩니다. 가볍게 즐기는 간식이지만, 지역의 온기를 담아 정성껏 만든 한 입의 맛은, 길 위에서 잠시 쉬어가는 시간을 더욱 달콤하게 채워줍니다. 그 속엔 오래도록 기억될 정겨운 이야기들이 숨어 있습니다."
                    }
                leftText={selectedTheme === "카페" 
                        ? "카페산" 
                        : selectedTheme === "맛집"
                        ? "연사랑"
                        : selectedTheme === "숙소"
                        ? "라한호텔"
                        : "천안옛날호두과자"
                    }
                rightTitle={selectedTheme === "카페" 
                        ? "추천 음료" 
                        : selectedTheme === "맛집"
                        ? "요리"
                        : selectedTheme === "숙소"
                        ? "등급"
                        : "대표 메뉴"
                    }
                rightText={selectedTheme === "카페" 
                        ? "필터커피" 
                        : selectedTheme === "맛집"
                        ? "한식"
                        : selectedTheme === "숙소"
                        ? "4성"
                        : "앙버터"
                    }
            />
            <Footer/>
        </>
    )
}

export default Theme
