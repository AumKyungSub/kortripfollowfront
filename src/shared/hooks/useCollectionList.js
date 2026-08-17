import { useEffect, useState, useMemo } from "react";
import { API_URL } from '@/shared/config/apiUrl';

export const useCollectionList = ({ lang = "ko" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(
          `${API_URL}/collections`
        );
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  /* ---------------- visibility 필터 ---------------- */
  const visibleCollections = useMemo(() => {
    return data.filter(item => item?.visibility);
  }, [data]);

/* ---------------- 플랫폼별 다국어 및 빈 URL 필터링 헬퍼 함수 ---------------- */
  const transformLinks = (platformObj, lang) => {
    if (!platformObj) return null;

    const transformed = {};

    Object.entries(platformObj).forEach(([productType, itemData]) => {
      if (typeof itemData === 'object' && itemData !== null) {
        // 1. url 추출 (객체인 경우와 단순 문자열인 경우 모두 호환)
        const currentUrl = typeof itemData.url === 'object' 
          ? itemData.url?.[lang] || '' 
          : (itemData.url || '');

        // 💡 2. url이 비어있으면 ("") 리스트에 포함하지 않음 (렌더링 제외)
        if (!currentUrl.trim()) return;

        // 3. title, price 추출 (단순 문자열인 경우 fallback 처리)
        const titleVal = typeof itemData.title === 'object'
          ? itemData.title?.[lang] || ''
          : (itemData.title || '');

        const priceVal = typeof itemData.price === 'object'
          ? itemData.price?.[lang] || ''
          : (itemData.price || '');

        transformed[productType] = {
          url: currentUrl,
          title: titleVal,
          price: priceVal,
        };
      } else if (typeof itemData === 'string' && itemData.trim() !== '') {
        // 기존 문자열 형태(구 DB) 호환성 유지
        transformed[productType] = { url: itemData, title: '', price: '' };
      }
    });
// 남은 카드가 하나도 없으면 null 반환
    return Object.keys(transformed).length > 0 ? transformed : null;
  };
  /* ---------------- 다국어 가공 ---------------- */
  const collections = useMemo(() => {
    return visibleCollections.map(item => ({
      id: item.id,
      img: `${item.img.link}`,
      title: item.description?.title?.[lang],
      text: item.description?.text?.[lang],
      camera: item.description?.camera?.[lang],
      content: item.description?.content?.[lang],
      tag: item.description?.tag?.[lang],
      size: item.description?.size,
      sell: item.description?.sell?.[lang],
      minimumPrice: item.description?.minimumPrice?.[lang],
      // 여기서 언어(lang)에 맞게 title, price를 가공
      zazzle: transformLinks(item.links?.zazzle, lang),
      mapple: transformLinks(item.links?.mapple, lang),
      redbubble: transformLinks(item.links?.redbubble, lang),
      zazzleShop: item.links?.zazzleShop,
      mappleShop: item.links?.mappleShop,
    }));
  }, [visibleCollections, lang]);

  return {
    collections,
    loading,
  };
};
