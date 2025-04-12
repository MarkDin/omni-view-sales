
import React, { useState } from 'react';
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

// Sample product data
const productsData = [
  { 
    id: 1, 
    name: 'MDF板', 
    category: '板材',
    price: 350,
    inventory: 1250,
    sales: 3580000,
    growth: 12.5,
    profit: 1075000,
    margin: 30,
    customers: 48,
  },
  { 
    id: 2, 
    name: 'PS格栅板', 
    category: '装饰板',
    price: 420,
    inventory: 950,
    sales: 2890000,
    growth: 8.3,
    profit: 980000,
    margin: 34,
    customers: 36,
  },
  { 
    id: 3, 
    name: 'PVC装饰线', 
    category: '装饰线',
    price: 120,
    inventory: 2300,
    sales: 2160000,
    growth: -2.4,
    profit: 650000,
    margin: 30,
    customers: 52,
  },
  { 
    id: 4, 
    name: 'PE户外地板', 
    category: '地板',
    price: 580,
    inventory: 750,
    sales: 3140000,
    growth: 15.2,
    profit: 1100000,
    margin: 35,
    customers: 32,
  },
  { 
    id: 5, 
    name: 'SPC地板', 
    category: '地板',
    price: 320,
    inventory: 1100,
    sales: 2560000,
    growth: 6.7,
    profit: 790000,
    margin: 31,
    customers: 38,
  },
  { 
    id: 6, 
    name: 'PVC墙板', 
    category: '墙板',
    price: 280,
    inventory: 1450,
    sales: 2380000,
    growth: -1.3,
    profit: 710000,
    margin: 30,
    customers: 42,
  },
  { 
    id: 7, 
    name: 'WPC室外地板', 
    category: '地板',
    price: 610,
    inventory: 680,
    sales: 3250000,
    growth: 18.9,
    profit: 1300000,
    margin: 40,
    customers: 28,
  }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  
  // Sort products
  const sortedProducts = [...productsData].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField as keyof typeof a] > b[sortField as keyof typeof b] ? 1 : -1;
    } else {
      return a[sortField as keyof typeof a] < b[sortField as keyof typeof b] ? 1 : -1;
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
  const handleProductDrilldown = (product: any) => {
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
                    <span className="text-3xl font-bold">¥19,960,000</span>
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
                    <span className="text-3xl font-bold">32.8%</span>
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
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>地板</span>
                      <span className="font-medium">43%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-dashboard-purple h-2 rounded-full" style={{ width: "43%" }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>板材</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span>装饰线/板</span>
                      <span className="font-medium">29%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "29%" }}></div>
                    </div>
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
