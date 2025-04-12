
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Dashboard/Header';
import Sidebar from '@/components/Dashboard/Sidebar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ArrowUp, ArrowDown, Download, 
  Filter, TrendingUp, TrendingDown, BarChart2 
} from 'lucide-react';
import DrilldownModal from '@/components/Dashboard/DrilldownModal';

// Sample customer data
const customerData = [
  { 
    id: 1, 
    name: '泰科电子有限公司', 
    industry: '电子制造',
    contactPerson: '张明',
    contactPhone: '13812345678',
    revenue: 650000, 
    orders: 12,
    growth: 15, 
    status: 'active',
    products: ['MDF板', 'PVC装饰线', '铝合金墙板配件'],
    lastPurchase: '2025-04-01',
    region: '华东',
  },
  { 
    id: 2, 
    name: '中科智能科技', 
    industry: '智能家居',
    contactPerson: '李强',
    contactPhone: '13987654321',
    revenue: 450000,
    orders: 8, 
    growth: 8, 
    status: 'active',
    products: ['PS格栅板', 'PET胶管板', 'PVC装饰线'],
    lastPurchase: '2025-03-28',
    region: '华北',
  },
  { 
    id: 3, 
    name: '远大集团', 
    industry: '建筑材料',
    contactPerson: '王建',
    contactPhone: '13765432198',
    revenue: 380000, 
    orders: 15,
    growth: -3, 
    status: 'at-risk',
    products: ['SPC地板', 'PE户外地板', 'PS踢脚线'],
    lastPurchase: '2025-03-15',
    region: '华南',
  },
  { 
    id: 4, 
    name: '华星电子', 
    industry: '电子元件',
    contactPerson: '刘芳',
    contactPhone: '13612345678',
    revenue: 320000, 
    orders: 6,
    growth: 12, 
    status: 'active',
    products: ['MDF装饰线', 'PS格栅板'],
    lastPurchase: '2025-04-05',
    region: '华东',
  },
  { 
    id: 5, 
    name: '蓝光科技有限公司', 
    industry: '光电技术',
    contactPerson: '陈晓',
    contactPhone: '13598765432',
    revenue: 280000, 
    orders: 4,
    growth: -5, 
    status: 'at-risk',
    products: ['PVC地板配件'],
    lastPurchase: '2025-02-18',
    region: '西南',
  },
  { 
    id: 6, 
    name: '恒基建材集团', 
    industry: '建筑材料',
    contactPerson: '赵伟',
    contactPhone: '13756789012',
    revenue: 720000, 
    orders: 18,
    growth: 22, 
    status: 'active',
    products: ['PVC装饰线', 'PE户外地板', 'PS踢脚线', 'MDF板'],
    lastPurchase: '2025-04-02',
    region: '华中',
  },
  { 
    id: 7, 
    name: '东方装饰材料有限公司', 
    industry: '室内装饰',
    contactPerson: '钱明',
    contactPhone: '13812378945',
    revenue: 530000, 
    orders: 13,
    growth: 9, 
    status: 'active',
    products: ['PVC平面墙板', 'MDF格栅墙板', 'PS格栅板'],
    lastPurchase: '2025-03-22',
    region: '东北',
  },
  { 
    id: 8, 
    name: '安家建材科技', 
    industry: '新型建材',
    contactPerson: '孙艳',
    contactPhone: '13687654321',
    revenue: 290000, 
    orders: 7,
    growth: -8, 
    status: 'at-risk',
    products: ['PE户外拼接板', 'SPC地板'],
    lastPurchase: '2025-03-10',
    region: '西北',
  }
];

const Customers = () => {
  const [activePage, setActivePage] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'revenue', direction: 'desc' });
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const navigate = useNavigate();

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Render sort indicator
  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  // Filter and sort the customer data
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customerData];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return result;
  }, [customerData, searchTerm, sortConfig]);

  // Handle customer drill-down
  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setDrilldownOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">活跃</Badge>;
      case 'at-risk':
        return <Badge className="bg-orange-500">风险</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <Header 
            title="客户分析" 
            description="查看和分析客户数据，包括购买历史、增长趋势和状态" 
          />

          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold">客户列表</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="搜索客户..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <Button variant="outline" size="icon" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span className="hidden sm:inline">筛选</span>
                </Button>
                <Button variant="outline" size="icon" className="flex items-center gap-2">
                  <Download size={16} />
                  <span className="hidden sm:inline">导出</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        客户名称
                        {renderSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('industry')}
                    >
                      <div className="flex items-center">
                        行业
                        {renderSortIcon('industry')}
                      </div>
                    </TableHead>
                    <TableHead>联系人</TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort('revenue')}
                    >
                      <div className="flex items-center justify-end">
                        销售额
                        {renderSortIcon('revenue')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort('orders')}
                    >
                      <div className="flex items-center justify-end">
                        订单数
                        {renderSortIcon('orders')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right"
                      onClick={() => handleSort('growth')}
                    >
                      <div className="flex items-center justify-end">
                        同比增长
                        {renderSortIcon('growth')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-center"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        状态
                        {renderSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('region')}
                    >
                      <div className="flex items-center">
                        地区
                        {renderSortIcon('region')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <TableRow 
                      key={customer.id} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <TableCell className="font-medium text-dashboard-purple">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.industry}</TableCell>
                      <TableCell>{customer.contactPerson}</TableCell>
                      <TableCell className="text-right">¥{customer.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{customer.orders}</TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end ${customer.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {customer.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span className="ml-1">{customer.growth}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.region}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAndSortedCustomers.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                未找到符合条件的客户
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CustomerDetailModal
        open={drilldownOpen}
        onClose={() => setDrilldownOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

// Customer detail modal component
interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
  customer: any;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ 
  open, 
  onClose, 
  customer 
}) => {
  if (!customer) return null;

  // Sample purchase history data
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

  return (
    <DrilldownModal
      open={open}
      onClose={onClose}
      section="customer"
      data={customer}
    />
  );
};

export default Customers;
