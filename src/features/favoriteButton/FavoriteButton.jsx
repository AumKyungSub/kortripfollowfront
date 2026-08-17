import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ApiError, memberApi } from '@/shared/api/memberApi';
import './FavoriteButton.style.css';

const FavoriteButton = ({ placeType, placeId }) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [authenticated, setAuthenticated] = useState(null);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let active = true;
    memberApi(`/favorites/status?placeType=${encodeURIComponent(placeType)}&placeId=${placeId}`)
      .then((data) => {
        if (active) {
          setFavorite(data.favorite);
          setAuthenticated(true);
        }
      })
      .catch((error) => {
        if (active) setAuthenticated(error instanceof ApiError && error.status === 401 ? false : null);
      });
    return () => { active = false; };
  }, [placeType, placeId]);

  const toggleFavorite = async () => {
    if (authenticated === false) {
      navigate('/myTravel');
      return;
    }
    setPending(true);
    setFeedback('');
    try {
      if (favorite) {
        await memberApi(`/favorites/${placeType}/${placeId}`, { method: 'DELETE' });
        setFavorite(false);
      } else {
        await memberApi('/favorites', { method: 'POST', body: { placeType, placeId } });
        setFavorite(true);
        setAuthenticated(true);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        navigate('/myTravel');
      } else {
        setFeedback(lang === 'ko' ? '다시 시도해 주세요' : 'Please try again');
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`favoriteButton ${favorite ? 'active' : ''}`}
      onClick={toggleFavorite}
      disabled={pending}
      aria-pressed={favorite}
      title={feedback}
    >
      <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
      {feedback || (favorite
        ? (lang === 'ko' ? '찜 해제' : 'Saved')
        : (lang === 'ko' ? '찜하기' : 'Save'))}
    </button>
  );
};

export default FavoriteButton;
