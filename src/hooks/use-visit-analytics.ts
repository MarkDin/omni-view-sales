
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface VisitRecord {
  id: string;
  user_email: string | null;
  visit_start_time: string;
  visit_end_time: string | null;
  device_info: {
    userAgent?: string;
    platform?: string;
    language?: string;
    screenWidth?: number;
    screenHeight?: number;
  } | Json;
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

interface DeviceDistributionResponse {
  platform: string;
  count: number;
}

interface MarketDistributionResponse {
  market: string;
  count: number;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
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
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0
  });
  const { toast } = useToast();

  const fetchVisitRecords = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Fetch paginated records using edge function
      const { data: paginatedData, error: paginationError } = await supabase.functions.invoke('paginated-visit-records', {
        body: { page, pageSize: pagination.pageSize }
      });

      if (paginationError) throw paginationError;

      // Update pagination state and records
      if (paginatedData) {
        setVisitRecords(paginatedData.records);
        setPagination({
          currentPage: paginatedData.currentPage,
          totalPages: paginatedData.totalPages,
          pageSize: paginatedData.pageSize,
          totalCount: paginatedData.totalCount
        });
      }

      // 获取独立访客数和总访问量
      const { data: visitorsCountData, error: visitorsCountError } = await supabase
        .rpc('get_visit_metrics');
        
      if (visitorsCountError) throw visitorsCountError;
      
      // 获取设备分布数据
      const { data: deviceData, error: deviceError } = await supabase
        .rpc('get_device_distribution');
        
      if (deviceError) throw deviceError;
      
      // 获取地区分布数据 (每人每天只计一次)
      const { data: marketData, error: marketError } = await supabase
        .rpc('get_market_distribution_unique_daily');
        
      if (marketError) throw marketError;
      
      // 转换数据格式 - 增加安全检查
      const deviceDistribution: DeviceDistribution[] = Array.isArray(deviceData) 
        ? deviceData.map((item) => ({
            name: item.platform || '未知平台',
            value: Number(item.count)
          })).sort((a, b) => b.value - a.value) 
        : [];
      
      const marketDistribution: MarketDistribution[] = Array.isArray(marketData) 
        ? marketData.map((item) => ({
            name: item.market || '未知地区',
            value: Number(item.count)
          })).sort((a, b) => b.value - a.value) 
        : [];
      
      // 确保 device_info 字段符合 VisitRecord 接口要求
      const typedRecords = Array.isArray(paginatedData?.records) 
        ? paginatedData?.records.map((record: any) => ({
            ...record,
            device_info: record.device_info || {}
          })) as VisitRecord[]
        : [];
      
      setVisitRecords(typedRecords);
      
      // 安全地访问返回的数据
      const visitMetrics = visitorsCountData && visitorsCountData.length > 0 ? visitorsCountData[0] : null;
      
      setMetrics({
        totalVisits: visitMetrics ? visitMetrics.total_visits : 0,
        uniqueVisitors: visitMetrics ? visitMetrics.unique_visitors : 0,
        averageDuration: visitMetrics ? visitMetrics.avg_duration : null,
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

  // Initial fetch
  useEffect(() => {
    fetchVisitRecords(1);
  }, []);

  return {
    visitRecords,
    loading,
    metrics,
    pagination,
    fetchVisitRecords
  };
};
