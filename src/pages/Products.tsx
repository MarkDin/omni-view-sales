
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Search, ChevronUp, ChevronDown, 
  ArrowUpDown, TrendingUp, TrendingDown 
} from 'lucide-react';
import ProductDrilldownModal from '@/components/Dashboard/ProductDrilldownModal';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Define product data type
interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number;
  sales: number;
  growth: number;
  profit: number;
  margin: number;
  customers: number;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  
  // Fetch products from Supabase
  const { data: productsData = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        toast.error("加载产品数据失败");
        throw error;
      }
      
      return data as ProductData[];
    }
  });
  
  // Sort products
  const sortedProducts = [...productsData].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField as keyof ProductData] > b[sortField as keyof ProductData] ? 1 : -1;
    } else {
      return a[sortField as keyof ProductData] < b[sortField as keyof ProductData] ? 1 : -1;
    }
  });
  
  // Filter products
  const filteredProducts = sortedProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Open drilldown for selected product
  const handleProductDrilldown = (product: ProductData) => {
    setSelectedProduct(product);
    setDrilldownOpen(true);
  };
  
  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} />;
    }
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Calculate summary statistics
  const totalSales = productsData.reduce((sum, product) => sum + product.sales, 0);
  const weightedMargin = productsData.reduce((sum, product) => sum + (product.margin * product.sales), 0) / totalSales;
  const averageMargin = isNaN(weightedMargin) ? 0 : parseFloat(weightedMargin.toFixed(1));
  
  // Calculate category distribution
  const categoryTotals: Record<string, number> = {};
  productsData.forEach(product => {
    if (categoryTotals[product.category]) {
      categoryTotals[product.category] += product.sales;
    } else {
      categoryTotals[product.category] = product.sales;
    }
  });
  
  const categoryDistribution: {name: string, percentage: number}[] = [];
  const totalSalesSum = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  Object.entries(categoryTotals).forEach(([category, sales]) => {
    const percentage = totalSalesSum > 0 ? Math.round((sales / totalSalesSum) * 100) : 0;
    categoryDistribution.push({ name: category, percentage });
  });
  
  // Sort categories by percentage (descending)
  categoryDistribution.sort((a, b) => b.percentage - a.percentage);

  // Get category color class
  const getCategoryColorClass = (index: number) => {
    const colors = [
      "bg-dashboard-purple",
      "bg-blue-500",
      "bg-orange-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="products" setActivePage={() => {}} />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <Header 
            title="产品销售" 
            description="产品销量、利润率和趋势分析" 
          />
          
          <div className="flex flex-col gap-6">
            {/* Product Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">总产品销售额</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold">¥{totalSales.toLocaleString()}</span>
                    <span className="ml-2 flex items-center text-green-600 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      +8.3%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">相比上一季度</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">平均利润率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold">{averageMargin}%</span>
                    <span className="ml-2 flex items-center text-green-600 text-sm">
                      <TrendingUp size={16} className="mr-1" />
                      +1.2%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">相比上一季度</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">产品类别分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    {categoryDistribution.slice(0, 3).map((category, index) => (
                      <React.Fragment key={category.name}>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span>{category.name}</span>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div className={`${getCategoryColorClass(index)} h-2 rounded-full`} style={{ width: `${category.percentage}%` }}></div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Product Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>产品销售列表</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="搜索产品..."
                      className="pl-8 w-full md:w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>加载产品数据...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>加载数据出错</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="w-[200px] cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            <div className="flex items-center">
                              产品名称 {getSortIcon('name')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort('category')}
                          >
                            <div className="flex items-center">
                              类别 {getSortIcon('category')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-right cursor-pointer"
                            onClick={() => handleSort('price')}
                          >
                            <div className="flex items-center justify-end">
                              单价 {getSortIcon('price')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-right cursor-pointer"
                            onClick={() => handleSort('sales')}
                          >
                            <div className="flex items-center justify-end">
                              销售额 {getSortIcon('sales')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-right cursor-pointer"
                            onClick={() => handleSort('growth')}
                          >
                            <div className="flex items-center justify-end">
                              增长率 {getSortIcon('growth')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="text-right cursor-pointer"
                            onClick={() => handleSort('margin')}
                          >
                            <div className="flex items-center justify-end">
                              利润率 {getSortIcon('margin')}
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              没有找到匹配的产品
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow 
                              key={product.id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() => handleProductDrilldown(product)}
                            >
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell className="text-right">¥{product.price}</TableCell>
                              <TableCell className="text-right">¥{product.sales.toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className={`flex items-center justify-end ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.growth >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                                  {product.growth >= 0 ? '+' : ''}{product.growth}%
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{product.margin}%</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  显示 {filteredProducts.length} 个产品（共 {productsData.length} 个）
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {selectedProduct && (
        <ProductDrilldownModal 
          open={drilldownOpen} 
          onClose={() => setDrilldownOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
