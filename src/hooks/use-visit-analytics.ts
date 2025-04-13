
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VisitRecord {
  id: string;
  user_email: string | null;
  visit_start_time: string;
  visit_end_time: string | null;
  device_info: {
    userAgent: string;
    platform: string;
    language: string;
    screenWidth: number;
    screenHeight: number;
  };
  market: string | null;
  path: string;
  created_at: string | null;
}

interface DeviceDistribution {
  name: string;
  value: number;
}

interface MarketDistribution {
  name: string;
  value: number;
}

interface VisitMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  averageDuration: number | null;
  deviceDistribution: DeviceDistribution[];
  marketDistribution: MarketDistribution[];
}

// 定义后端返回的RPC函数返回类型
interface VisitMetricsResponse {
  total_visits: number;
  unique_visitors: number;
  avg_duration: number | null;
}

interface DistributionResponse {
  platform?: string;
  market?: string;
  count: number;
}

export const useVisitAnalytics = () => {
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [metrics, setMetrics] = useState<VisitMetrics>({
    totalVisits: 0,
    uniqueVisitors: 0,
    averageDuration: null,
    deviceDistribution: [],
    marketDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVisitRecords = async () => {
    try {
      setLoading(true);
      
      // 获取基础访问记录
      const { data: recordsData, error: recordsError } = await supabase
        .from('visit_records')
        .select('*')
        .order('visit_start_time', { ascending: false });

      if (recordsError) throw recordsError;
      
      // 获取独立访客数和总访问量
      const { data: visitorsCountData, error: visitorsCountError } = await supabase
        .rpc<VisitMetricsResponse>('get_visit_metrics');
        
      if (visitorsCountError) throw visitorsCountError;
      
      // 获取设备分布数据
      const { data: deviceData, error: deviceError } = await supabase
        .rpc<DistributionResponse[]>('get_device_distribution');
        
      if (deviceError) throw deviceError;
      
      // 获取地区分布数据 (每人每天只计一次)
      const { data: marketData, error: marketError } = await supabase
        .rpc<DistributionResponse[]>('get_market_distribution_unique_daily');
        
      if (marketError) throw marketError;
      
      // 转换数据格式
      const deviceDistribution: DeviceDistribution[] = deviceData?.map((item) => ({
        name: item.platform || '未知平台',
        value: Number(item.count)
      })).sort((a, b) => b.value - a.value) || [];
      
      const marketDistribution: MarketDistribution[] = marketData?.map((item) => ({
        name: item.market || '未知地区',
        value: Number(item.count)
      })).sort((a, b) => b.value - a.value) || [];
      
      // 更新状态
      setVisitRecords(recordsData || []);
      setMetrics({
        totalVisits: visitorsCountData?.[0]?.total_visits || 0,
        uniqueVisitors: visitorsCountData?.[0]?.unique_visitors || 0,
        averageDuration: visitorsCountData?.[0]?.avg_duration || null,
        deviceDistribution,
        marketDistribution
      });
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

  useEffect(() => {
    fetchVisitRecords();
  }, []);

  return {
    visitRecords,
    loading,
    metrics,
    fetchVisitRecords
  };
};
