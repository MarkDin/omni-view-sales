
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Dashboard/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface VisitRecord {
  id: string;
  user_email: string | null;
  visit_start_time: string;
  device_info: string;
  market: string | null;
  created_at: string;
}

const VisitInfo = () => {
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // 记录当前访问
    recordVisit();
    
    // 获取所有访问记录
    fetchVisitRecords();

    // 添加Google Analytics跟踪代码
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID'; // 替换为你的GA ID
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-MEASUREMENT_ID'); // 替换为你的GA ID
      };
    }
  }, []);

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
          market = `${locationData.city}, ${locationData.country_name}`;
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }

      // 插入访问记录
      const { error } = await supabase.from('visit_records').insert({
        user_email: user?.email || null,
        visit_start_time: new Date().toISOString(),
        device_info: JSON.stringify(deviceInfo),
        market: market
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error recording visit:', error.message);
    }
  };

  const fetchVisitRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visit_records')
        .select('*')
        .order('visit_start_time', { ascending: false });

      if (error) throw error;

      setVisitRecords(data || []);
    } catch (error: any) {
      toast({
        title: "获取记录失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDeviceInfo = (deviceInfoString: string) => {
    try {
      const deviceInfo = JSON.parse(deviceInfoString);
      return `${deviceInfo.platform} - ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`;
    } catch {
      return deviceInfoString;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="访问记录" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>网站访问记录</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-purple"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>访问时间</TableHead>
                    <TableHead>用户邮箱</TableHead>
                    <TableHead>设备信息</TableHead>
                    <TableHead>访问地区</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitRecords.length > 0 ? (
                    visitRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.visit_start_time)}</TableCell>
                        <TableCell>{record.user_email || '未登录用户'}</TableCell>
                        <TableCell>{formatDeviceInfo(record.device_info)}</TableCell>
                        <TableCell>{record.market || '未知'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">暂无访问记录</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VisitInfo;
