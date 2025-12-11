import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useReadOneDB = (collection, id) => {
    const { t } = useTranslation();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dbURL = import.meta.env.VITE_API_URL;

    const fetchOne = useCallback(async () => {
        if (!collection || !id) return;
        
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${dbURL}/${collection}/${id}`);
            if (!res.ok) throw new Error(t("common.error"));

            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("ID 데이터 로딩 실패:", err);
            setError(t("common.error"));
        } finally {
            setLoading(false);
        }
    }, [collection, id, dbURL, t]);

    useEffect(() => {
        fetchOne();
    }, [fetchOne]);

    return { data, loading, error, refetch: fetchOne };
};
