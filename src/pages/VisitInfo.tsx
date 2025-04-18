
import React, { useEffect } from 'react';
import { useVisitAnalytics } from '@/hooks/use-visit-analytics';
import Header from '@/components/Dashboard/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeviceDistributionChart } from '@/components/Analytics/DeviceDistributionChart';
import { MarketDistributionChart } from '@/components/Analytics/MarketDistributionChart';
import { MetricCard } from '@/components/Analytics/MetricCard';
import { Users, Clock, MousePointer, LayoutGrid } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const VisitInfo = () => {
  const { visitRecords, loading, metrics, pagination, fetchVisitRecords } = useVisitAnalytics();

  useEffect(() => {
    fetchVisitRecords();
  }, []);

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

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '暂无数据';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
      return `${minutes}分 ${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="访问数据分析" description="查看网站访问数据和用户行为" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="总访问量" 
            value={metrics.totalVisits}
            icon={<MousePointer size={20} />} 
          />
          <MetricCard 
            title="独立访客" 
            value={metrics.uniqueVisitors}
            icon={<Users size={20} />} 
          />
          <MetricCard 
            title="平均访问时长" 
            value={formatDuration(metrics.averageDuration)}
            icon={<Clock size={20} />} 
          />
          <MetricCard 
            title="访问页面数" 
            value={new Set(visitRecords.map(r => r.path)).size}
            icon={<LayoutGrid size={20} />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>设备分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <Skeleton className="w-full h-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>地区分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <Skeleton className="w-full h-full" />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <DeviceDistributionChart data={metrics.deviceDistribution} />
              <MarketDistributionChart data={metrics.marketDistribution} />
            </>
          )}
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>详细访问记录</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
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
                </div>
                
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => fetchVisitRecords(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="gap-1"
                        >
                          上一页
                        </Button>
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => fetchVisitRecords(i + 1)}
                            isActive={pagination.currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchVisitRecords(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="gap-1"
                        >
                          下一页
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VisitInfo;
