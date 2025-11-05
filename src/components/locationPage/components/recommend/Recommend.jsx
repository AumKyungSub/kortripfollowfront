import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import RecommendComponent from './RecommendComponent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Page css
import './Recommend.style.css';

const Recommend = () => {
    const { id } = useParams();
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

        // 화면 크기 변경 시 반응형 처리
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        setRegion(null); // id가 바뀌면 이전 데이터 초기화
        setLoading(true);

        // fetch(`http://172.30.1.1:3000/rankings/${id}`)
        // fetch(`http://localhost:3000/rankings/${id}`)
        fetch(`https://port-0-kortripfollow-mhg6zzrn5356f2c9.sel3.cloudtype.app/rankings/${id}`)
        .then(res => res.json())
        .then(data => {
            setRegion(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id]);
    
    if (loading) return <div>로딩중...</div>;
    if (!region) return <div>데이터가 없습니다.</div>;

    const galleryData = isMobile ? region.gallery : region.galleryPc;

  return (
    <div className='topRecommendCover'>
      <h1>갤러리</h1>
      {galleryData && galleryData.length > 0 && galleryData[0] !== "" ? (
        <RecommendComponent item={{ ...region, gallery: galleryData }} />
      ) : (
      <div>갤러리가 비어있습니다..</div>
      )}
    </div>
  );
};

export default Recommend;
