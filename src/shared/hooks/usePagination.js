import { useState, useMemo, useCallback, useEffect } from 'react';

export const usePagination = (items = [], itemsPerPage = 8, dependency = null) => {
    const [currentPage, setCurrentPage] = useState(1);

  // 총 페이지 수 계산
    const totalPages = useMemo(() => {
        return Math.ceil(items.length / itemsPerPage) || 1;
    }, [items.length, itemsPerPage]);

    // 현재 페이지에 해당하는 아이템 슬라이싱
    const pagedList = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }, [items, currentPage, itemsPerPage]);

    // 페이지 변경 핸들러
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    // 의존성(카테고리, 필터 등) 변경 시 1페이지로 자동 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [dependency]);

    return {
        currentPage,
        totalPages,
        pagedList,
        handlePageChange,
        setCurrentPage, // 필요 시 직접 컨트롤할 수 있게 함께 반환
    };
};