
import React, { useState, useEffect } from 'react';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import Header from '@/components/Dashboard/Header';
import KPICards from '@/components/Dashboard/KPICards';
import SalesChart from '@/components/Dashboard/SalesChart';
import CustomerOverview from '@/components/Dashboard/CustomerOverview';
import RegionalSales from '@/components/Dashboard/RegionalSales';
import PipelineAnalysis from '@/components/Dashboard/PipelineAnalysis';
import DrilldownModal from '@/components/Dashboard/DrilldownModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/use-analytics';

const Index = () => {
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // 如果用户已登录，记录访问信息
    if (user) {
      // 记录首页访问
      trackEvent('page_view', {
        page_title: '仪表盘概览',
        user_id: user.id
      });
      
      // 记录访问记录到数据库
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      };
      
      // 异步获取位置信息
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(locationData => {
          const market = `${locationData.city}, ${locationData.country_name}`;
          
          // 插入访问记录
          supabase.from('visit_records').insert({
            user_email: user.email,
            visit_start_time: new Date().toISOString(),
            device_info: JSON.stringify(deviceInfo),
            market: market
          }).then(({ error }) => {
            if (error) console.error('Error recording visit:', error);
          });
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          
          // 即使没有位置信息也记录访问
          supabase.from('visit_records').insert({
            user_email: user.email,
            visit_start_time: new Date().toISOString(),
            device_info: JSON.stringify(deviceInfo),
            market: null
          }).then(({ error }) => {
            if (error) console.error('Error recording visit:', error);
          });
        });
    }
  }, [user]);

  const handleDrillDown = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsDrilldownOpen(true);
    
    // 跟踪下钻事件
    trackEvent('drill_down', {
      section: customerId
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="仪表盘概览" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <KPICards onDrillDown={handleDrillDown} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SalesChart onDrillDown={() => handleDrillDown('revenue')} />
            <PipelineAnalysis onDrillDown={() => handleDrillDown('pipeline')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CustomerOverview onDrillDown={(customerId) => handleDrillDown('customer', customerId)} />
            </div>
            <RegionalSales onDrillDown={() => handleDrillDown('regional')} />
          </div>
        </main>
      </div>

      <DrilldownModal
        open={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        section={selectedCustomerId}
      />
    </div>
  );
};

export default Index;
