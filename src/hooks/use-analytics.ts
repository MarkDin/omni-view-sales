
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 用于跟踪页面浏览和事件的Google Analytics钩子
 */
export const useAnalytics = () => {
  const location = useLocation();
  
  // 追踪页面浏览
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-MEASUREMENT_ID', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  // 跟踪事件
  const trackEvent = (
    eventName: string, 
    eventParams?: {
      [key: string]: any;
    }
  ) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, eventParams);
    }
  };

  return { trackEvent };
};
