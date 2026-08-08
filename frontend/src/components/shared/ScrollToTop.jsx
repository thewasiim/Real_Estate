import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top instantly without smooth scrolling or flicker
    // unless the user is navigating to a specific hash on the page
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Some older browsers don't support 'instant', but it's safe to pass. Standard is 'auto'. 
      });
      // Fallback for older browsers
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
    }
  }, [pathname, hash]);

  return null;
}
