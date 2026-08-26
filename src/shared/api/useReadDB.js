import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from '@/shared/config/apiUrl';

export const useReadDB = () => {
  const { t } = useTranslation(); // i18n 불러오기

    const [data, setData] = useState({
        blogs: [],
        rankings: [],
        seasons: [],
        cafes: [],
        restaurants: [],
        lodgings: [],
        foods: [],
        markets: [],
        parks: [],
        oceans: [],
        drives: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dbURL = API_URL;

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const urls = {
                blogs: `${dbURL}/blogs`,
                rankings: `${dbURL}/rankings`,
                seasons: `${dbURL}/seasons`,
                cafes: `${dbURL}/cafes`,
                restaurants: `${dbURL}/restaurants`,
                lodgings: `${dbURL}/lodgings`,
                foods: `${dbURL}/foods`,
                markets: `${dbURL}/markets`,
                parks: `${dbURL}/parks`,
                oceans: `${dbURL}/oceans`,
                drives: `${dbURL}/drives`,
            };

            const responses = await Promise.all([
                fetch(urls.blogs),
                fetch(urls.rankings),
                fetch(urls.seasons),
                fetch(urls.cafes),
                fetch(urls.restaurants),
                fetch(urls.lodgings),
                fetch(urls.foods),
                fetch(urls.markets),
                fetch(urls.parks),
                fetch(urls.oceans),
                fetch(urls.drives),
            ]);

      // 하나라도 실패하면 throw
      responses.forEach((res) => {
        if (!res.ok) throw new Error("API Error");
      });

            const [
                blogs,
                rankings,
                seasons,
                cafes,
                restaurants,
                lodgings,
                foods,
                markets,
                parks,
                oceans,
                drives,
            ] = await Promise.all(responses.map((res) => res.json()));

            setData({
                blogs,
                rankings,
                seasons,
                cafes,
                restaurants,
                lodgings,
                foods,
                markets,
                parks,
                oceans,
                drives,
            });
        } catch (err) {
            console.error("데이터 로딩 실패:", err);
            setError(t("common.error"));
        } finally {
            setLoading(false);
        }
    }, [dbURL, t]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { data, loading, error, refetch: fetchAll };
};
