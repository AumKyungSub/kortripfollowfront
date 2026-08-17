import { useLanguage } from '@/shared/hooks/useLanguage';
import './PlaceRating.style.css';

const PlaceRating = ({ summary, variant = 'default' }) => {
  const { lang } = useLanguage();
  const average = Number(summary?.average);
  const count = Number(summary?.count);
  if (!Number.isFinite(average) || !Number.isInteger(count) || count < 1) return null;

  const label = lang === 'ko'
    ? `방문자 평점 ${average.toFixed(1)}, 평가 ${count}개`
    : `Visitor rating ${average.toFixed(1)} from ${count} rating${count === 1 ? '' : 's'}`;

  return (
    <span className={`placeRating ${variant}`} aria-label={label} title={label}>
      <span aria-hidden="true">★</span>
      {average.toFixed(1)}
    </span>
  );
};

export default PlaceRating;
