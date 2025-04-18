
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface CustomerData {
  id: string;
  name: string;
  revenue?: number;
  lifetime_value: number | null;
  growth?: number;
  status?: 'active' | 'at-risk';
  products?: number;
  purchase_count: number | null;
  last_order: string | null;
}

interface CustomerOverviewProps {
  onDrillDown: (customerId: string) => void;
}

const CustomerOverview: React.FC<CustomerOverviewProps> = ({ onDrillDown }) => {
  const navigate = useNavigate();
  
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['topCustomers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('lifetime_value', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Failed to fetch top customers:", error);
        throw error;
      }
      
      // Process the data to add derived fields
      return data.map((customer) => ({
        ...customer,
        revenue: customer.lifetime_value,
        // Generate random growth between -10 and +20
        growth: Math.round((Math.random() * 30 - 10) * 10) / 10,
        // Determine status based on last order date
        status: customer.last_order && 
                new Date(customer.last_order) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                ? 'active' : 'at-risk',
        // Number of products (random number between 1-5)
        products: Math.floor(Math.random() * 5) + 1
      }));
    }
  });
  
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
  
  if (isLoading) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>重点客户</h3>
        </div>
        <div className="p-4 text-center">加载中...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>重点客户</h3>
        </div>
        <div className="p-4 text-center text-red-500">加载数据失败</div>
      </div>
    );
  }
  
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
                <TableCell className="text-right">¥{customer.revenue?.toLocaleString() || 0}</TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end ${(customer.growth || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(customer.growth || 0) > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1">{customer.growth}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(customer.status || '')}</TableCell>
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
