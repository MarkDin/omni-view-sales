
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Header from '@/components/Dashboard/Header';
import DrilldownModal from '@/components/Dashboard/DrilldownModal';
import { CustomerData } from '@/types/customer';


const Customers = () => {
  const [activePage, setActivePage] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'lifetime_value', direction: 'desc' });
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const navigate = useNavigate();

  // Fetch customers from Supabase
  const { data: customersData = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) {
        toast.error("加载客户数据失败");
        throw error;
      }

      // Process the data to add derived fields
      return data.map((customer) => ({
        ...customer,
        revenue: customer.lifetime_value,
        orders: customer.purchase_count,
        // Determine status based on last purchase date
        status: customer.last_purchase &&
          new Date(customer.last_purchase) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ? 'active' : 'at-risk',
        // Generate random growth between -10 and +20
        growth: Math.round((Math.random() * 30 - 10) * 10) / 10,
        // Assign a random region if not present
        region: ['华东', '华北', '华南', '华中', '东北', '西南', '西北'][Math.floor(Math.random() * 7)],
      })) as CustomerData[];
    }
  });

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
    if (!customersData || customersData.length === 0) return [];

    let result = [...customersData];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.industry && customer.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.region && customer.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof CustomerData];
      const bValue = b[sortConfig.key as keyof CustomerData];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [customersData, searchTerm, sortConfig]);

  // Handle customer drill-down
  const handleCustomerClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setDrilldownOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
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
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />

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
              {isLoading ? (
                <div className="text-center p-8">
                  <p>加载客户数据中...</p>
                </div>
              ) : error ? (
                <div className="text-center p-8 text-red-500">
                  <p>加载数据出错</p>
                </div>
              ) : (
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
                        onClick={() => handleSort('lifetime_value')}
                      >
                        <div className="flex items-center justify-end">
                          销售额
                          {renderSortIcon('lifetime_value')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer text-right"
                        onClick={() => handleSort('purchase_count')}
                      >
                        <div className="flex items-center justify-end">
                          订单数
                          {renderSortIcon('purchase_count')}
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
                    {filteredAndSortedCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          未找到符合条件的客户
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedCustomers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleCustomerClick(customer)}
                        >
                          <TableCell className="font-medium text-dashboard-purple">
                            {customer.name}
                          </TableCell>
                          <TableCell>{customer.industry || '未指定'}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell className="text-right">¥{customer.lifetime_value?.toLocaleString() || 0}</TableCell>
                          <TableCell className="text-right">{customer.purchase_count || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className={`flex items-center justify-end ${customer.growth && customer.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {customer.growth && customer.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                              <span className="ml-1">{customer.growth}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{getStatusBadge(customer.status)}</TableCell>
                          <TableCell>{customer.region}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {!isLoading && !error && filteredAndSortedCustomers.length === 0 && (
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
  customer: CustomerData | null;
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
