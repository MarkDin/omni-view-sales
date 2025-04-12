
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
import { ChevronLeft, Download, Share2 } from "lucide-react";

interface DrilldownModalProps {
  open: boolean;
  onClose: () => void;
  section: string;
  data?: any;
}

const DrilldownModal: React.FC<DrilldownModalProps> = ({ open, onClose, section, data }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [periodFilter, setPeriodFilter] = useState('monthly');

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
      default:
        return '数据详情';
    }
  };

  // Gets the appropriate chart based on the section and viewMode
  const getContent = () => {
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
          
          <Tabs value={periodFilter} onValueChange={setPeriodFilter}>
            <TabsList>
              <TabsTrigger value="daily">日</TabsTrigger>
              <TabsTrigger value="weekly">周</TabsTrigger>
              <TabsTrigger value="monthly">月</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mt-4 overflow-hidden">
          {getContent()}
        </div>
        
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
