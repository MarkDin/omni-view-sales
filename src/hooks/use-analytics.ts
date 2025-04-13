
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 用于跟踪页面浏览和事件的综合分析钩子
 * 集成Google Analytics和Supabase访问记录
 */
export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // 追踪页面浏览并记录访问
  useEffect(() => {
    // 1. Google Analytics 追踪
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-MEASUREMENT_ID', {
        page_path: location.pathname + location.search
      });
    }
    
    // 2. 记录访问到Supabase数据库
    const recordVisit = async () => {
      try {
        // 获取设备信息
        const deviceInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height
        };
        
        // 尝试获取用户位置
        let market = "未知";
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const locationData = await response.json();
            market = `${locationData.city || '未知城市'}, ${locationData.country_name || '未知国家'}`;
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }

        // 插入访问记录
        const { error } = await supabase.from('visit_records').insert({
          user_email: user?.email || null,
          visit_start_time: new Date().toISOString(),
          device_info: deviceInfo,
          market: market,
          path: location.pathname
        });

        if (error) throw error;
      } catch (error: any) {
        console.error('Error recording visit:', error.message);
      }
    };
    
    // 执行记录操作
    recordVisit();
    
    // 当用户离开页面时可以执行清理操作
    return () => {
      // 如有必要可以在这里添加页面离开时的逻辑
    };
  }, [location, user]); // 依赖于location和user，当它们变化时重新记录

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
