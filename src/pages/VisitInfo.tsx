
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
  device_info: {
    userAgent: string;
    platform: string;
    language: string;
    screenWidth: number;
    screenHeight: number;
  };
  market: string | null;
  path: string;
  created_at: string;
}

const VisitInfo = () => {
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchVisitRecords();
  }, []);

  const fetchVisitRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visit_records')
        .select('*')
        .order('visit_start_time', { ascending: false });

      if (error) throw error;

      setVisitRecords(data as VisitRecord[]);
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

  const formatDeviceInfo = (deviceInfo: any) => {
    if (!deviceInfo) return '未知设备';
    
    if (typeof deviceInfo === 'string') {
      try {
        deviceInfo = JSON.parse(deviceInfo);
      } catch {
        return deviceInfo;
      }
    }
    
    return `${deviceInfo.platform || '未知平台'} - ${deviceInfo.screenWidth || '?'}x${deviceInfo.screenHeight || '?'}`;
  };

  const getPageName = (path: string) => {
    const pathMap: Record<string, string> = {
      '/': '仪表盘',
      '/customers': '客户分析',
      '/products': '产品销售',
      '/orders': '订单管理',
      '/excel-upload': 'Excel上传',
      '/visit-info': '访问记录',
      '/auth': '登录页面'
    };
    
    return pathMap[path] || path;
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
                    <TableHead>访问页面</TableHead>
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
                        <TableCell>{getPageName(record.path)}</TableCell>
                        <TableCell>{record.user_email || '未登录用户'}</TableCell>
                        <TableCell>{formatDeviceInfo(record.device_info)}</TableCell>
                        <TableCell>{record.market || '未知'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">暂无访问记录</TableCell>
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
