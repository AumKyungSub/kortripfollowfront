import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: 479 });
  const isFold = useMediaQuery({ minWidth: 480, maxWidth: 767 });
  const isFullMobile = useMediaQuery({maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isFullTablet = useMediaQuery({ minWidth: 480, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return { isMobile, isFold, isFullMobile, isTablet, isFullTablet ,isDesktop };
};
