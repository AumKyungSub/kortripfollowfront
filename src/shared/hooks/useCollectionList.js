import { useEffect, useState, useMemo } from "react";

export const useCollectionList = ({ lang = "ko" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/collections`
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
      zazzle: item.links?.zazzle,
      mapple: item.links?.mapple,
      zazzleShop: item.links?.zazzleShop,
      mappleShop: item.links?.mappleShop
    }));
  }, [visibleCollections, lang]);

  return {
    collections,
    loading,
  };
};