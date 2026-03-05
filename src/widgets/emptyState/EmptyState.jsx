import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './EmptyState.style.css';

const EmptyState = ({ message, subMessage, buttonText, onButtonClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="emptyStateWrapper">
            <div className="emptyStateContent">
                <img
                    src="/images/empty-state.png"
                    alt="No places found"
                    className="emptyStateImg"
                />
                <h2 className="emptyStateTitle">{message || t('emptyState.emptyStateTitle')}</h2>
                <p className="emptyStateSub">{subMessage || t('emptyState.emptyStateSub')}</p>
                <button className="clickBtnCover" onClick={handleButtonClick}>
                    {buttonText || "홈으로 가기"}
                </button>
            </div>
        </div>
    );
};

export default EmptyState;
