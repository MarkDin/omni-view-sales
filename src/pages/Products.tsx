
import React, { useState, useEffect } from 'react';
import ProductsCharts from '@/components/Products/ProductsCharts';
import ProductsSummaryCards from '@/components/Products/ProductsSummaryCards';
import ProductsTable from '@/components/Products/ProductsTable';
import ProductSearchFilters from '@/components/Products/ProductSearchFilters';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import Header from '@/components/Dashboard/Header';
import { ProductData, CategoryCount } from '@/types/product';
import { calculateCategoryDistribution } from '@/components/Products/ProductUtils';

// Update mockProducts to include created_at field to match the type definition
const mockProducts: ProductData[] = [
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    name: "智能手机",
    category: "电子产品",
    price: 899,
    inventory: 150,
    sales: 320,
    growth: 0.15,
    profit: 55000,
    margin: 0.20,
    customers: 280,
    created_at: "2023-05-15T08:30:00Z"
  },
  {
    id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
    name: "运动鞋",
    category: "服装",
    price: 79,
    inventory: 600,
    sales: 950,
    growth: 0.22,
    profit: 68000,
    margin: 0.35,
    customers: 820,
    created_at: "2023-04-20T10:15:00Z"
  },
  {
    id: "01234567-89ab-cdef-0123-456789abcdef",
    name: "咖啡机",
    category: "家用电器",
    price: 129,
    inventory: 200,
    sales: 480,
    growth: 0.08,
    profit: 35000,
    margin: 0.27,
    customers: 410,
    created_at: "2023-06-01T14:45:00Z"
  },
  {
    id: "bcdeff23-4567-890a-bcde-f1234567890a",
    name: "背包",
    category: "配件",
    price: 49,
    inventory: 800,
    sales: 1200,
    growth: 0.18,
    profit: 42000,
    margin: 0.30,
    customers: 1050,
    created_at: "2023-03-10T09:20:00Z"
  },
  {
    id: "9abcdef0-1234-5678-9abc-def012345678",
    name: "平板电脑",
    category: "电子产品",
    price: 349,
    inventory: 250,
    sales: 550,
    growth: 0.12,
    profit: 60000,
    margin: 0.25,
    customers: 480,
    created_at: "2023-07-05T11:30:00Z"
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);

  // Extract unique categories for filter
  const uniqueCategories = Array.from(new Set(mockProducts.map(product => product.category)));

  // Calculate category distribution for charts
  useEffect(() => {
    setCategoryData(calculateCategoryDistribution(products));
  }, [products]);

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    applyFilters(searchTerm, categoryFilter);
  };

  const handleCategoryFilter = (category: string | null) => {
    setCategoryFilter(category);
    applyFilters(searchQuery, category);
  };

  const applyFilters = (search: string, category: string | null) => {
    let filteredProducts = [...mockProducts];
    
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    setProducts(filteredProducts);
    setIsFiltering(!!search || !!category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setIsFiltering(false);
    setProducts(mockProducts);
  };

  const handleProductClick = (product: ProductData) => {
    console.log('Product clicked:', product);
    // Future implementation for product details view
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <OrdersSidebar />
        <div className="flex-1 flex flex-col">
          <Header title="产品管理" description="查看和管理所有产品" />
          <main className="flex-1 p-4">
            <ProductsSummaryCards products={products} />
            
            <ProductSearchFilters 
              searchQuery={searchQuery}
              setSearchQuery={handleSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={handleCategoryFilter}
              isFiltering={isFiltering}
              setIsFiltering={setIsFiltering}
              uniqueCategories={uniqueCategories}
              clearFilters={clearFilters}
            />
            
            <ProductsCharts 
              products={products} 
              categoryData={categoryData} 
            />
            
            <ProductsTable 
              products={products} 
              handleProductClick={handleProductClick} 
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
