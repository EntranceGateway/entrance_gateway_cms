import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Debug component to verify route changes are being detected
 * Remove this after testing
 */
export const RouteChangeDetector = () => {
  const location = useLocation();

  useEffect(() => {
    // Route change detected
  }, [location.pathname]);

  return null;
};
