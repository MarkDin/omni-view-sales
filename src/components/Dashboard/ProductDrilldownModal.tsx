
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
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { ChevronLeft, Download, Share2, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample data
const regionData = [
  { name: '华东', value: 42 },
  { name: '华北', value: 28 },
  { name: '华南', value: 18 },
  { name: '西南', value: 8 },
  { name: '西北', value: 4 }
];

const monthlyData = [
  { name: '1月', value: 280000 },
  { name: '2月', value: 230000 },
  { name: '3月', value: 310000 },
  { name: '4月', value: 320000 },
  { name: '5月', value: 290000 },
  { name: '6月', value: 350000 },
  { name: '7月', value: 380000 },
  { name: '8月', value: 320000 },
  { name: '9月', value: 340000 },
  { name: '10月', value: 370000 },
  { name: '11月', value: 390000 },
  { name: '12月', value: 420000 }
];

const topCustomers = [
  { id: 1, name: '广州市某建材有限公司', amount: 450000, growth: 8.5 },
  { id: 2, name: '杭州市某家居集团', amount: 380000, growth: 12.3 },
  { id: 3, name: '南京市某装饰工程公司', amount: 340000, growth: -2.1 },
  { id: 4, name: '上海市某建筑材料有限公司', amount: 320000, growth: 5.7 },
  { id: 5, name: '北京市某家居有限公司', amount: 290000, growth: 3.2 }
];

const inventoryHistory = [
  { month: '1月', stock: 1450 },
  { month: '2月', stock: 1380 },
  { month: '3月', stock: 1520 },
  { month: '4月', stock: 1320 },
  { month: '5月', stock: 1280 },
  { month: '6月', stock: 1450 },
  { month: '7月', stock: 1520 },
  { month: '8月', stock: 1350 },
  { month: '9月', stock: 1250 },
  { month: '10月', stock: 1320 },
  { month: '11月', stock: 1400 },
  { month: '12月', stock: 1250 }
];

interface ProductDrilldownModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    inventory: number;
    sales: number;
    growth: number;
    profit: number;
    margin: number;
    customers: number;
  };
}

const ProductDrilldownModal: React.FC<ProductDrilldownModalProps> = ({ 
  open, 
  onClose, 
  product 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const COLORS = ['#8b5cf6', '#2563eb', '#f97316', '#7c3aed', '#93c5fd'];
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              <ChevronLeft size={16} />
            </Button>
            {product.name} 产品详情
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">概览</TabsTrigger>
              <TabsTrigger value="regions" className="flex-1">区域分析</TabsTrigger>
              <TabsTrigger value="customers" className="flex-1">客户分析</TabsTrigger>
              <TabsTrigger value="trends" className="flex-1">趋势分析</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-lg">产品信息</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">产品类别</p>
                      <p>{product.category}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">单价</p>
                      <p>¥{product.price}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">现有库存</p>
                      <p>{product.inventory}件</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">购买客户数</p>
                      <p>{product.customers}个</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-lg">销售数据</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">年销售额</p>
                      <p className="text-xl font-semibold">¥{product.sales.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">年利润</p>
                      <p>¥{product.profit.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">利润率</p>
                      <p>{product.margin}%</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">增长率</p>
                      <div className={`flex items-center ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">月度销售趋势</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `¥${value/1000}k`} />
                      <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '金额']} />
                      <Bar dataKey="value" fill="#7c3aed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">区域销售占比</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '占比']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="regions" className="mt-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-medium mb-3 text-lg">区域销售占比</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, '占比']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium mb-3 text-lg">区域销售金额</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: '华东', value: product.sales * 0.42 },
                          { name: '华北', value: product.sales * 0.28 },
                          { name: '华南', value: product.sales * 0.18 },
                          { name: '西南', value: product.sales * 0.08 },
                          { name: '西北', value: product.sales * 0.04 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(value) => `¥${value/10000}万`} />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '销售额']} />
                        <Bar dataKey="value" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">区域增长率比较</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {['华东', '华北', '华南', '西南', '西北'].map((region, idx) => {
                    // Generate random growth rates for regions
                    const growthValues = [14.2, 9.7, -3.5, 18.4, 6.2];
                    const growth = growthValues[idx];
                    return (
                      <div key={region} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-lg font-medium">{region}</h4>
                        <div className={`text-xl font-bold flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                          {growth >= 0 ? '+' : ''}{growth}%
                        </div>
                        <p className="text-sm text-gray-500 mt-2">相比上年</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers" className="mt-4">
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-lg">客户购买分布</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '大型企业', value: 45 },
                          { name: '中型企业', value: 30 },
                          { name: '小型企业', value: 25 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#2563eb" />
                        <Cell fill="#f97316" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-lg">客户平均采购周期</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500">大型企业</h4>
                    <p className="text-xl font-bold">45天</p>
                    <div className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp size={14} className="mr-1" />
                      提前5天
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500">中型企业</h4>
                    <p className="text-xl font-bold">62天</p>
                    <div className="text-sm text-red-600 flex items-center mt-1">
                      <TrendingDown size={14} className="mr-1" />
                      延后3天
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500">小型企业</h4>
                    <p className="text-xl font-bold">90天</p>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      无变化
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-lg">主要客户</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>客户名称</TableHead>
                        <TableHead className="text-right">采购金额</TableHead>
                        <TableHead className="text-right">增长率</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="text-right">¥{customer.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className={`flex items-center justify-end ${customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {customer.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                              {customer.growth >= 0 ? '+' : ''}{customer.growth}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={customer.growth >= 0 ? "bg-green-500" : "bg-orange-500"}>
                              {customer.growth >= 0 ? "稳定" : "关注"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-lg">销售趋势 (过去12个月)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
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
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 text-lg">库存趋势 (过去12个月)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={inventoryHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={['dataMin - 200', 'dataMax + 200']} />
                        <Tooltip formatter={(value) => [`${value}件`, '库存']} />
                        <Line
                          type="monotone"
                          dataKey="stock"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-lg">季度销售对比</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Q1', current: 820000, previous: 720000 },
                        { name: 'Q2', current: 960000, previous: 850000 },
                        { name: 'Q3', current: 1040000, previous: 970000 },
                        { name: 'Q4', current: 1180000, previous: 1050000 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `¥${value/10000}万`} />
                      <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="current" name="本年" fill="#7c3aed" />
                      <Bar dataKey="previous" name="去年" fill="#93c5fd" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2 text-lg">产品生命周期阶段</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-dashboard-purple bg-purple-100">
                        成长期
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-dashboard-purple">
                        75%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-100">
                    <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-dashboard-purple"></div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

export default ProductDrilldownModal;
