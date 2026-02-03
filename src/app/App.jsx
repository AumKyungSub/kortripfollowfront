//Components
import Router from '@/app/providers/Router';

//Language for Fonts
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

// Page css
import './styles/App.css'

const App = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('ko') ? 'ko' : 'en'
  }, [i18n.language])
  
  return <Router />;
};

export default App
