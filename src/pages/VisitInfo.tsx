
import React from 'react';
import { useVisitAnalytics } from '@/hooks/use-visit-analytics';
import Header from '@/components/Dashboard/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeviceDistributionChart } from '@/components/Analytics/DeviceDistributionChart';
import { MarketDistributionChart } from '@/components/Analytics/MarketDistributionChart';
import { MetricCard } from '@/components/Analytics/MetricCard';
import { Users, Clock, MousePointer, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const VisitInfo = () => {
  const { visitRecords, loading, metrics, pagination, fetchVisitRecords } = useVisitAnalytics();

  React.useEffect(() => {
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

  // 生成要显示的页码
  const getVisiblePages = () => {
    const { currentPage, totalPages } = pagination;
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <Header title="访问数据分析" description="查看网站访问数据和用户行为分析" />

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Metric Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="总访问量" 
            value={metrics.totalVisits}
            icon={<MousePointer className="h-5 w-5 text-blue-500" />}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          />
          <MetricCard 
            title="独立访客" 
            value={metrics.uniqueVisitors}
            icon={<Users className="h-5 w-5 text-purple-500" />}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          />
          <MetricCard 
            title="平均访问时长" 
            value={formatDuration(metrics.averageDuration)}
            icon={<Clock className="h-5 w-5 text-green-500" />}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          />
          <MetricCard 
            title="访问页面数" 
            value={new Set(visitRecords.map(r => r.path)).size}
            icon={<LayoutGrid className="h-5 w-5 text-orange-500" />}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <>
              <Card className="backdrop-blur-sm bg-white/50">
                <CardHeader>
                  <CardTitle>设备分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <Skeleton className="w-full h-full rounded-lg" />
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-white/50">
                <CardHeader>
                  <CardTitle>地区分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <Skeleton className="w-full h-full rounded-lg" />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="backdrop-blur-sm bg-white/50 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>设备分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <DeviceDistributionChart data={metrics.deviceDistribution} />
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-white/50 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>地区分布</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <MarketDistributionChart data={metrics.marketDistribution} />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Visit Records Table */}
        <Card className="backdrop-blur-sm bg-white/50">
          <CardHeader className="border-b">
            <CardTitle>详细访问记录</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
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
                        <TableHead className="font-medium">访问时间</TableHead>
                        <TableHead className="font-medium">访问页面</TableHead>
                        <TableHead className="font-medium">用户邮箱</TableHead>
                        <TableHead className="font-medium">设备信息</TableHead>
                        <TableHead className="font-medium">访问地区</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitRecords.length > 0 ? (
                        visitRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50">
                            <TableCell className="text-sm">{formatDate(record.visit_start_time)}</TableCell>
                            <TableCell className="text-sm font-medium">{getPageName(record.path)}</TableCell>
                            <TableCell className="text-sm">{record.user_email || '未登录用户'}</TableCell>
                            <TableCell className="text-sm">{formatDeviceInfo(record.device_info)}</TableCell>
                            <TableCell className="text-sm">{record.market || '未知'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            暂无访问记录
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-center py-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => fetchVisitRecords(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {/* Show first page and ellipsis */}
                      {pagination.currentPage > 3 && (
                        <>
                          <PaginationItem>
                            <PaginationLink onClick={() => fetchVisitRecords(1)}>
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {pagination.currentPage > 4 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                        </>
                      )}
                      
                      {/* Show current page group */}
                      {visiblePages.map(page => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => fetchVisitRecords(page)}
                            isActive={pagination.currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {/* Show last page and ellipsis */}
                      {pagination.currentPage < pagination.totalPages - 2 && (
                        <>
                          {pagination.currentPage < pagination.totalPages - 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink onClick={() => fetchVisitRecords(pagination.totalPages)}>
                              {pagination.totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => fetchVisitRecords(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                        />
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
