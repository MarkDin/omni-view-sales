
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
  
  useEffect(() => {
    let visitRecordId: string | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

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
        const { data, error } = await supabase.from('visit_records').insert({
          user_email: user?.email || null,
          visit_start_time: new Date().toISOString(),
          device_info: deviceInfo,
          market: market,
          path: location.pathname
        }).select();

        if (error) throw error;
        
        // 存储访问记录ID
        if (data && data.length > 0) {
          visitRecordId = data[0].id;
        }
      } catch (error: any) {
        console.error('Error recording visit:', error.message);
      }
    };
    
    // 更新访问记录的结束时间
    const updateVisitEndTime = async () => {
      if (visitRecordId) {
        try {
          await supabase
            .from('visit_records')
            .update({ 
              visit_end_time: new Date().toISOString() 
            })
            .eq('id', visitRecordId);
        } catch (error: any) {
          console.error('Error updating visit end time:', error.message);
        }
      }
    };

    // 执行记录操作
    recordVisit();
    
    // 设置页面离开事件监听
    const handlePageLeave = () => {
      // 5秒后更新访问结束时间
      timeoutId = setTimeout(updateVisitEndTime, 5000);
    };

    // 取消监听器的函数
    const cleanup = () => {
      // 清除延迟更新的定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // 立即更新访问结束时间
      updateVisitEndTime();
    };

    // 添加页面离开事件监听
    window.addEventListener('beforeunload', handlePageLeave);
    
    // 返回清理函数
    return () => {
      window.removeEventListener('beforeunload', handlePageLeave);
      cleanup();
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
