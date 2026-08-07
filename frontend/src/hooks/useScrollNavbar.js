import { useState, useEffect } from 'react';

/**
 * Tracks scroll position for navbar transparency → solid transition.
 */
export function useScrollNavbar(threshold = 40) {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSolid(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isSolid;
}
