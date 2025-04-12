import React, { useState } from 'react';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent
} from '@/components/ui/popover';
import { 
  ChevronDown, 
  Package, 
  MoreHorizontal, 
  Search, 
  Filter, 
  X
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import ProductDrilldownModal from '@/components/Dashboard/ProductDrilldownModal';

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

interface Summary {
  totalRevenue: number;
  totalProducts: number;
  totalProfit: number;
  avgMargin: number;
}

interface CategoryCount {
  name: string;
  value: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FF8042'];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data as ProductData[];
    }
  });

  const calculateSummary = (products: ProductData[]): Summary => {
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalMargin = 0;
    let marginCount = 0;
    
    products.forEach(product => {
      if (product.sales) totalRevenue += product.sales;
      if (product.profit) totalProfit += product.profit;
      if (product.margin) {
        totalMargin += product.margin;
        marginCount++;
      }
    });
    
    return {
      totalRevenue,
      totalProducts: products.length,
      totalProfit,
      avgMargin: marginCount > 0 ? Math.round(totalMargin / marginCount) : 0
    };
  };

  const summary = calculateSummary(products);

  const calculateCategoryDistribution = (products: ProductData[]): CategoryCount[] => {
    const categoryCounts: Record<string, number> = {};
    
    products.forEach(product => {
      if (!categoryCounts[product.category]) {
        categoryCounts[product.category] = 1;
      } else {
        categoryCounts[product.category] += 1;
      }
    });
    
    return Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));
  };

  const categoryData = calculateCategoryDistribution(products);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: ProductData) => {
    setSelectedProduct(product);
    setIsDrilldownOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setIsFiltering(false);
  };

  const uniqueCategories = Array.from(new Set(products.map(product => product.category)));

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <OrdersSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">产品管理</h1>
          <div className="text-center py-10">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <OrdersSidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">产品管理</h1>
          <div className="text-center py-10 text-red-500">加载失败，请稍后重试</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">产品管理</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-500">总销售额</h3>
              <Package className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">¥{summary.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-500">产品总数</h3>
              <Package className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{summary.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-500">总利润</h3>
              <Package className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">¥{summary.totalProfit.toLocaleString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-500">平均利润率</h3>
              <Package className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{summary.avgMargin}%</p>
          </div>
        </div>
        
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
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 className="text-lg font-medium mb-4 md:mb-0">产品列表</h3>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="搜索产品..."
                  className="pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={18} />
                    筛选
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-4">
                    <h4 className="font-medium">分类</h4>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCategories.map((category) => (
                        <Badge
                          key={category}
                          variant={categoryFilter === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            setCategoryFilter(category);
                            setIsFiltering(true);
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {(searchQuery || categoryFilter) && (
                <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                  <X size={18} />
                  清除筛选
                </Button>
              )}
            </div>
          </div>
          
          {isFiltering && categoryFilter && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">筛选条件:</span>
              <Badge className="flex items-center gap-1">
                {categoryFilter}
                <button onClick={() => setCategoryFilter(null)}>
                  <X size={14} />
                </button>
              </Badge>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>产品名称</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead className="text-right">价格</TableHead>
                  <TableHead className="text-right">库存</TableHead>
                  <TableHead className="text-right">销售额</TableHead>
                  <TableHead className="text-right">增长率</TableHead>
                  <TableHead className="text-right">利润率</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id} 
                    className="cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">¥{product.price}</TableCell>
                    <TableCell className="text-right">{product.inventory || 0}</TableCell>
                    <TableCell className="text-right">¥{product.sales?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.growth && product.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                        {product.growth ? `${product.growth}%` : '0%'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{product.margin || 0}%</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}>
                        <MoreHorizontal size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <ProductDrilldownModal 
          open={isDrilldownOpen} 
          onClose={() => setIsDrilldownOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Products;
