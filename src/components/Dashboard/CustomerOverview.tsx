
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const customers = [
  { 
    id: 1, 
    name: '泰科电子有限公司', 
    revenue: 650000, 
    growth: 15, 
    status: 'active',
    products: 5
  },
  { 
    id: 2, 
    name: '中科智能科技', 
    revenue: 450000, 
    growth: 8, 
    status: 'active',
    products: 3
  },
  { 
    id: 3, 
    name: '远大集团', 
    revenue: 380000, 
    growth: -3, 
    status: 'at-risk',
    products: 4
  },
  { 
    id: 4, 
    name: '华星电子', 
    revenue: 320000, 
    growth: 12, 
    status: 'active',
    products: 2
  },
  { 
    id: 5, 
    name: '蓝光科技有限公司', 
    revenue: 280000, 
    growth: -5, 
    status: 'at-risk',
    products: 1
  }
];

interface CustomerOverviewProps {
  onDrillDown: (customerId: number) => void;
}

const CustomerOverview: React.FC<CustomerOverviewProps> = ({ onDrillDown }) => {
  const navigate = useNavigate();
  
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
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3>重点客户</h3>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={20} />
        </Button>
      </div>
      
      <div className="table-rounded">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>客户名称</TableHead>
              <TableHead className="text-right">年收入</TableHead>
              <TableHead className="text-right">同比增长</TableHead>
              <TableHead className="text-center">状态</TableHead>
              <TableHead className="text-center">产品数</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id} 
                className="table-row drill-down-card"
                onClick={() => onDrillDown(customer.id)}
              >
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-right">¥{customer.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end ${customer.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {customer.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1">{customer.growth}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(customer.status)}</TableCell>
                <TableCell className="text-center">{customer.products}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onDrillDown(customer.id)}>
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="link" 
          className="text-dashboard-purple"
          onClick={() => navigate('/customers')}
        >
          查看全部客户
        </Button>
      </div>
    </div>
  );
};

export default CustomerOverview;
