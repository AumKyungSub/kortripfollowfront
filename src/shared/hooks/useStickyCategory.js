import { useEffect, useState } from 'react';

export const useStickyCategory = (screenSize, offset = 51) => {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (!screenSize) return;

    const handleScroll = () => {
      setFixed(window.scrollY >= offset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [screenSize, offset]);

  return fixed;
};