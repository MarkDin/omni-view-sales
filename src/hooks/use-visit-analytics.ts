
import { useState, useMemo } from 'react';
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

export const useVisitAnalytics = () => {
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const metrics = useMemo<VisitMetrics>(() => {
    // Calculate total visits
    const totalVisits = visitRecords.length;

    // Calculate unique visitors (by email or device fingerprint)
    const uniqueEmails = new Set(visitRecords
      .filter(record => record.user_email)
      .map(record => record.user_email));
      
    const uniqueDevices = new Set(visitRecords
      .filter(record => !record.user_email && record.device_info)
      .map(record => JSON.stringify(record.device_info)));
      
    const uniqueVisitors = uniqueEmails.size + uniqueDevices.size;

    // Calculate average duration
    const recordsWithDuration = visitRecords.filter(
      record => record.visit_start_time && record.visit_end_time
    );
    
    let totalDuration = 0;
    recordsWithDuration.forEach(record => {
      const startTime = new Date(record.visit_start_time).getTime();
      const endTime = new Date(record.visit_end_time!).getTime();
      totalDuration += (endTime - startTime) / 1000; // in seconds
    });
    
    const averageDuration = recordsWithDuration.length > 0 
      ? totalDuration / recordsWithDuration.length 
      : null;

    // Calculate device distribution
    const deviceCounts: Record<string, number> = {};
    visitRecords.forEach(record => {
      if (record.device_info) {
        let platform;
        if (typeof record.device_info === 'string') {
          try {
            const parsed = JSON.parse(record.device_info);
            platform = parsed.platform || '未知平台';
          } catch {
            platform = '未知平台';
          }
        } else {
          platform = record.device_info.platform || '未知平台';
        }
        
        deviceCounts[platform] = (deviceCounts[platform] || 0) + 1;
      }
    });
    
    const deviceDistribution: DeviceDistribution[] = Object.entries(deviceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Calculate market distribution - 同一个人一天只记录一次
    const marketVisitors = new Map<string, Set<string>>();
    
    visitRecords.forEach(record => {
      const market = record.market || '未知地区';
      const visitorId = record.user_email || JSON.stringify(record.device_info) || record.id;
      const visitDate = new Date(record.visit_start_time).toLocaleDateString();
      const visitorKey = `${visitorId}-${visitDate}`;
      
      if (!marketVisitors.has(market)) {
        marketVisitors.set(market, new Set());
      }
      
      marketVisitors.get(market)!.add(visitorKey);
    });
    
    const marketCounts: Record<string, number> = {};
    marketVisitors.forEach((visitors, market) => {
      marketCounts[market] = visitors.size;
    });
    
    const marketDistribution: MarketDistribution[] = Object.entries(marketCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      totalVisits,
      uniqueVisitors,
      averageDuration,
      deviceDistribution,
      marketDistribution
    };
  }, [visitRecords]);

  return {
    visitRecords,
    loading,
    metrics,
    fetchVisitRecords
  };
};
