import { useEffect, useMemo, useRef, useState } from 'react';

/*------------------------hooks-----------------------------------*/
// Navigate
import { useNavigate } from 'react-router-dom';
/*------------------------/hooks-----------------------------------*/
/*------------------------custom hooks-----------------------------------*/
// Language
import { useLanguage } from '@/shared/hooks/useLanguage';
/*------------------------/custom hooks-----------------------------------*/

// Page Css
import './SearchModal.style.css';

const SEARCH_GROUPS = [
  { endpoint: 'rankings', category: 'attraction', path: (id) => `/location/${id}` },
  { endpoint: 'cafes', category: 'cafe', path: (id) => `/theme/cafe/${id}` },
  { endpoint: 'restaurants', category: 'restaurant', path: (id) => `/theme/restaurant/${id}` },
  { endpoint: 'lodgings', category: 'lodging', path: (id) => `/theme/lodging/${id}` },
  { endpoint: 'foods', category: 'food', path: (id) => `/theme/food/${id}` },
];

const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase();

const SearchModal = ({ onClose }) => {
  const { lang, t } = useLanguage();

  const activeLang = lang?.startsWith('en') ? 'en' : 'ko';
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = import.meta.env.VITE_API_URL;

    Promise.all(SEARCH_GROUPS.map(async (group) => {
      const response = await fetch(`${apiUrl}/${group.endpoint}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Search API error: ${group.endpoint}`);
      const data = await response.json();
      return data.map((item) => ({ ...item, searchCategory: group.category, searchPath: group.path(item.id) }));
    }))
      .then((groups) => {
        const uniqueItems = new Map();
        groups.flat().filter((item) => item.visibility === true).forEach((item) => {
          const signature = [item.id, item.img?.link, item.location?.name?.ko, item.location?.name?.en].join('|');
          if (!uniqueItems.has(signature)) uniqueItems.set(signature, item);
        });
        setItems([...uniqueItems.values()]);
        setStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    inputRef.current?.focus();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('search-modal-open');
    const handleKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('search-modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const results = useMemo(() => {
    const keyword = normalize(query);
    if (!keyword || status !== 'ready') return [];

    return items.filter((item) => {
      const location = item.location ?? {};
      const description = item.description ?? {};
      const searchable = [
        location.name?.[activeLang],
        location.region?.[activeLang],
        ...(Array.isArray(location.address?.[activeLang]) ? location.address[activeLang] : [location.address?.[activeLang]]),
        description.short?.[activeLang],
        description.slide?.[activeLang],
        ...(Array.isArray(description.tag?.[activeLang]) ? description.tag[activeLang] : []),
      ];
      return searchable.some((value) => normalize(value).includes(keyword));
    });
  }, [activeLang, items, query, status]);

  const selectResult = (item) => {
    onClose();
    navigate(item.searchPath);
  };

  const getAddress = (item) => {
    const address = item.location?.address?.[activeLang];
    return Array.isArray(address) ? address : [address].filter(Boolean);
  };

  const renderState = () => {
    if (status === 'loading') return <div className="searchModalState"><span className="searchModalSpinner" /><p>{t('searchModal.loading')}</p></div>;
    if (status === 'error') return <div className="searchModalState searchModalError"><span>!</span><p>{t('searchModal.error')}</p></div>;
    if (!query.trim()) return <div className="searchModalState">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>  
    <strong>{t('searchModal.initialTitle')}</strong><p>{t('searchModal.initialText')}</p></div>;
    if (!results.length) return <div className="searchModalState searchModalNoResult"><span className="searchSadIcon">☹</span><strong>{t('searchModal.noTitle')}</strong><p>{t('searchModal.noText')}</p></div>;

    return (
      <div className="searchResults">
        <p className="searchResultCount"> {t('searchModal.count', { count: results.length })}</p>
        <ul>
          {results.map((item) => (
            <li key={`${item.searchCategory}-${item.id}`}>
              <button type="button" onClick={() => selectResult(item)}>
                <img src={`${item.img?.link}3R.jpg`} alt="" />
                <span className="searchResultText">
                  <span className="searchResultTitle">
                    <strong>{item.location?.name?.[activeLang]}</strong>
                    <em>{t(`searchModal.categories.${item.searchCategory}`)}</em>
                  </span>
                  {activeLang === 'ko' && item.location?.name?.en && <span>{item.location.name.en}</span>}
                  {activeLang === 'en' && item.location?.name?.ko && <span>{item.location.name.ko}</span>}
                  <span>{[item.location?.region?.[activeLang], ...getAddress(item)].filter(Boolean).join(', ')}</span>
                </span>
                <span className="searchResultArrow" aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="searchModalOverlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="searchModal" role="dialog" aria-modal="true" aria-label={t('searchModal.search')}>
        <div className="searchModalInputRow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg> 
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchModal.placeholder')} aria-label={t('searchModal.search')} />
          {query && <button type="button" className="searchClearBtn" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label={t('searchModal.clear')}>×</button>}
          <button type="button" className="searchCloseBtn" onClick={onClose} aria-label={t('searchModal.close')}>×</button>
        </div>
        <div className="searchModalBody">{renderState()}</div>
      </section>
    </div>
  );
};

export default SearchModal;
