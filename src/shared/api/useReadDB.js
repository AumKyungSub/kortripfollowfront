import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useReadDB = () => {
  const { t } = useTranslation(); // i18n 불러오기

    const [data, setData] = useState({
        rankings: [],
        seasons: [],
        cafes: [],
        restaurants: [],
        lodgings: [],
        foods: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dbURL = import.meta.env.VITE_API_URL;

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const urls = {
                rankings: `${dbURL}/rankings`,
                seasons: `${dbURL}/seasons`,
                cafes: `${dbURL}/cafes`,
                restaurants: `${dbURL}/restaurants`,
                lodgings: `${dbURL}/lodgings`,
                foods: `${dbURL}/foods`,
            };

            const responses = await Promise.all([
                fetch(urls.rankings),
                fetch(urls.seasons),
                fetch(urls.cafes),
                fetch(urls.restaurants),
                fetch(urls.lodgings),
                fetch(urls.foods),
            ]);

            const [
                rankings,
                seasons,
                cafes,
                restaurants,
                lodgings,
                foods,
            ] = await Promise.all(responses.map((res) => res.json()));

            setData({
                rankings,
                seasons,
                cafes,
                restaurants,
                lodgings,
                foods,
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
