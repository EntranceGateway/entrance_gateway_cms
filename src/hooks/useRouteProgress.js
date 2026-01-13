import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track route changes
 * Can be used to trigger analytics, scroll to top, etc.
 */
export const useRouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // You can add analytics tracking here
    // trackPageView(location.pathname);
  }, [location.pathname]);

  return location;
};

export default useRouteProgress;
