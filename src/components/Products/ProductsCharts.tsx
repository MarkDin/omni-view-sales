
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number | null;
  sales: number | null;
  growth: number | null;
  profit: number | null;
  margin: number | null;
  customers: number | null;
  created_at: string | null;
}

interface CategoryCount {
  name: string;
  value: number;
}

interface ProductsChartsProps {
  products: ProductData[];
  categoryData: CategoryCount[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FF8042'];

const ProductsCharts: React.FC<ProductsChartsProps> = ({ products, categoryData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">销售额分析</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={products.slice(0, 7)}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="sales" name="销售额" fill="#8884d8" />
            <Bar dataKey="profit" name="利润" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">产品类别分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, '数量']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductsCharts;
