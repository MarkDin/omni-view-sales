
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, Download, Share2, Phone, Mail, MapPin, Building, Clock, CreditCard, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DrilldownModalProps {
  open: boolean;
  onClose: () => void;
  section: string;
  data?: any;
}

const DrilldownModal: React.FC<DrilldownModalProps> = ({ open, onClose, section, data }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [periodFilter, setPeriodFilter] = useState('monthly');
  const [customerTab, setCustomerTab] = useState('overview');

  // Sample data for different drilldowns
  const monthlyData = [
    { name: '1月', value: 350000 },
    { name: '2月', value: 280000 },
    { name: '3月', value: 390000 },
    { name: '4月', value: 480000 },
    { name: '5月', value: 380000 },
    { name: '6月', value: 520000 },
    { name: '7月', value: 620000 },
    { name: '8月', value: 510000 },
    { name: '9月', value: 490000 },
    { name: '10月', value: 570000 },
    { name: '11月', value: 640000 },
    { name: '12月', value: 750000 }
  ];

  const weeklyData = [
    { name: '第1周', value: 120000 },
    { name: '第2周', value: 145000 },
    { name: '第3周', value: 135000 },
    { name: '第4周', value: 170000 }
  ];

  const dailyData = [
    { name: '周一', value: 28000 },
    { name: '周二', value: 32000 },
    { name: '周三', value: 36000 },
    { name: '周四', value: 30000 },
    { name: '周五', value: 44000 },
  ];

  // Sample purchase history data for customer view
  const purchaseHistory = [
    { date: '2025-04-01', products: ['MDF板', 'PS格栅板'], amount: 120000 },
    { date: '2025-02-15', products: ['PVC装饰线', 'PE户外地板'], amount: 85000 },
    { date: '2025-01-10', products: ['SPC地板'], amount: 67000 },
    { date: '2024-12-05', products: ['PS格栅板', 'PE户外地板'], amount: 92000 },
    { date: '2024-10-20', products: ['MDF板', 'PS格栅板', 'PVC装饰线'], amount: 105000 },
  ];

  // Sample monthly revenue data
  const monthlyRevenueData = [
    { name: '2024-10', value: 105000 },
    { name: '2024-11', value: 0 },
    { name: '2024-12', value: 92000 },
    { name: '2025-01', value: 67000 },
    { name: '2025-02', value: 85000 },
    { name: '2025-03', value: 0 },
    { name: '2025-04', value: 120000 },
  ];

  // Gets the appropriate title based on the section
  const getTitle = () => {
    switch (section) {
      case 'revenue':
        return '销售额详情';
      case 'customers':
        return '客户详情';
      case 'orders':
        return '订单详情';
      case 'aov':
        return '平均客单价详情';
      case 'conversion':
        return '转化率详情';
      case 'target':
        return '目标完成详情';
      case 'customer':
        return data?.name || '客户详情';
      default:
        return '数据详情';
    }
  };

  // Render customer detail view
  const renderCustomerDetail = () => {
    if (section !== 'customer' || !data) return null;

    return (
      <>
        <div className="mb-6">
          <Tabs defaultValue={customerTab} value={customerTab} onValueChange={setCustomerTab}>
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">概览</TabsTrigger>
              <TabsTrigger value="purchases" className="flex-1">采购记录</TabsTrigger>
              <TabsTrigger value="products" className="flex-1">产品偏好</TabsTrigger>
              <TabsTrigger value="trends" className="flex-1">趋势分析</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-lg">客户信息</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">行业</p>
                        <p>{data.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">地区</p>
                        <p>{data.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">联系人</p>
                        <p>{data.contactPerson} - {data.contactPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">最近采购</p>
                        <p>{data.lastPurchase}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-lg">销售数据</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">年销售额</p>
                        <p className="text-xl font-semibold">
                          {data.revenue ? `¥${data.revenue.toLocaleString()}` : '¥0'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">订单数量</p>
                        <p>{data.orders}个</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {data.growth > 0 ? (
                        <div className="text-green-500 flex items-center">
                          增长率: +{data.growth}%
                        </div>
                      ) : (
                        <div className="text-red-500 flex items-center">
                          增长率: {data.growth}%
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">客户状态</p>
                      {data.status === 'active' ? (
                        <Badge className="bg-green-500">活跃</Badge>
                      ) : (
                        <Badge className="bg-orange-500">风险</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">产品偏好</h3>
                <div className="flex flex-wrap gap-2">
                  {data.products && data.products.map((product: string, index: number) => (
                    <Badge key={index} variant="secondary">{product}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">销售趋势</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `¥${value/1000}k`} />
                      <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '金额']} />
                      <Bar dataKey="value" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="purchases" className="mt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>日期</TableHead>
                      <TableHead>产品</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseHistory.map((purchase, index) => (
                      <TableRow key={index}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {purchase.products.map((product, i) => (
                              <Badge key={i} variant="outline">{product}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">¥{purchase.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-lg">产品购买频率</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'MDF板', value: 3 },
                            { name: 'PVC装饰线', value: 2 },
                            { name: 'PS格栅板', value: 3 },
                            { name: 'PE户外地板', value: 2 },
                            { name: 'SPC地板', value: 1 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {[
                            { name: 'MDF板', value: 3 },
                            { name: 'PVC装饰线', value: 2 },
                            { name: 'PS格栅板', value: 3 },
                            { name: 'PE户外地板', value: 2 },
                            { name: 'SPC地板', value: 1 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#8b5cf6', '#2563eb', '#f97316', '#7c3aed', '#93c5fd'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, '购买次数']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-lg">产品采购金额</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'MDF板', value: 180000 },
                          { name: 'PVC装饰线', value: 120000 },
                          { name: 'PS格栅板', value: 170000 },
                          { name: 'PE户外地板', value: 95000 },
                          { name: 'SPC地板', value: 67000 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '金额']} />
                        <Bar dataKey="value" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-4">
              <div className="h-80">
                <h3 className="font-medium mb-3 text-lg">季度销售趋势</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart
                    data={[
                      { name: '2023-Q1', value: 180000 },
                      { name: '2023-Q2', value: 220000 },
                      { name: '2023-Q3', value: 190000 },
                      { name: '2023-Q4', value: 250000 },
                      { name: '2024-Q1', value: 230000 },
                      { name: '2024-Q2', value: 310000 },
                      { name: '2024-Q3', value: 280000 },
                      { name: '2024-Q4', value: 350000 },
                      { name: '2025-Q1', value: 380000 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `¥${value/1000}k`} />
                    <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '销售额']} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 text-lg">客户生命周期阶段</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-dashboard-purple bg-purple-100">
                        增长期
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-dashboard-purple">
                        68%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-100">
                    <div style={{ width: "68%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-dashboard-purple"></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  };

  // Gets the appropriate chart based on the section and viewMode
  const getContent = () => {
    // If it's a customer drilldown, show the customer detail view
    if (section === 'customer') {
      return renderCustomerDetail();
    }
    
    const chartData = 
      periodFilter === 'monthly' ? monthlyData :
      periodFilter === 'weekly' ? weeklyData : dailyData;
    
    if (viewMode === 'chart') {
      // Determine the type of chart to show based on the section
      switch (section) {
        case 'revenue':
        case 'orders':
        case 'aov':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `¥${value/10000}万`} />
                <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '金额']} />
                <Legend />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          );
        case 'customers':
        case 'target':
          return (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          );
        case 'conversion':
          // For conversion rate, use a different data structure
          const conversionData = [
            { name: '网站访问', value: 5800 },
            { name: '产品演示', value: 1200 },
            { name: '方案定制', value: 820 },
            { name: '报价审核', value: 420 },
            { name: '合同签订', value: 180 }
          ];
          
          const COLORS = ['#8b5cf6', '#2563eb', '#f97316', '#7c3aed', '#93c5fd'];
          
          return (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, '数量']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          );
        default:
          return (
            <div className="flex justify-center items-center h-64 text-gray-400">
              暂无图表数据
            </div>
          );
      }
    } else {
      // Table view
      return (
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead className="text-right">数值</TableHead>
                <TableHead className="text-right">环比</TableHead>
                <TableHead className="text-right">同比</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((item, index) => {
                const prevValue = index > 0 ? chartData[index - 1].value : item.value;
                const mom = ((item.value - prevValue) / prevValue * 100).toFixed(1);
                
                return (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">¥{item.value.toLocaleString()}</TableCell>
                    <TableCell className={`text-right ${parseFloat(mom) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {parseFloat(mom) >= 0 ? '+' : ''}{mom}%
                    </TableCell>
                    <TableCell className="text-right">+8.2%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              <ChevronLeft size={16} />
            </Button>
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        {section !== 'customer' && (
          <div className="flex justify-between items-center my-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'chart' ? 'default' : 'outline'}
                onClick={() => setViewMode('chart')}
                className="text-sm"
              >
                图表视图
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="text-sm"
              >
                表格视图
              </Button>
            </div>
            
            <Tabs defaultValue={periodFilter} value={periodFilter} onValueChange={setPeriodFilter}>
              <TabsList>
                <TabsTrigger value="daily">日</TabsTrigger>
                <TabsTrigger value="weekly">周</TabsTrigger>
                <TabsTrigger value="monthly">月</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        <div className="mt-4 overflow-hidden">
          {getContent()}
        </div>
        
        {section !== 'customer' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">数据解读</h4>
            <p className="text-sm text-gray-600">
              {section === 'revenue' && '本期销售额较上期增长12.5%，主要得益于新产品线的推出和华东区域销售团队的拓展。'}
              {section === 'customers' && '新客户增长率维持在8%以上，主要来源于线上营销渠道和合作伙伴推荐。'}
              {section === 'orders' && '订单数量稳定增长，但小额订单比例有所增加，建议关注客单价提升策略。'}
              {section === 'aov' && '平均客单价略有下降，主要因为小型客户占比增加，建议加强大客户维护和产品附加值提升。'}
              {section === 'conversion' && '总体转化率保持在行业领先水平，但从产品演示到方案定制环节的流失率较高，需加强跟进。'}
              {section === 'target' && '目前完成年度目标的78%，按照季度趋势预计可超额完成年度销售目标。'}
            </p>
          </div>
        )}
        
        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} />
              <span>导出数据</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 size={16} />
              <span>分享</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DrilldownModal;
