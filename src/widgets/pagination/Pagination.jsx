import React from 'react';
import './Pagination.style.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="paginationWrapper">
            {/* 이전 버튼 */}
            <button
                className={`paginationBtn paginationArrow${currentPage === 1 ? ' paginationDisabled' : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
            >
                &#8249;
            </button>

            {/* 페이지 번호 버튼들 */}
            {pages.map((page) => (
                <button
                    key={page}
                    className={`paginationBtn${currentPage === page ? ' paginationActive' : ''}`}
                    onClick={() => onPageChange(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* 다음 버튼 */}
            <button
                className={`paginationBtn paginationArrow${currentPage === totalPages ? ' paginationDisabled' : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
            >
                &#8250;
            </button>
        </div>
    );
};

export default Pagination;
