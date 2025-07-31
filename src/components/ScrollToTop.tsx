import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop component that scrolls the window to the top
 * whenever the route changes
 */
export const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;