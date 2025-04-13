import React, { useState } from 'react';
import ProductsCharts from '@/components/Products/ProductsCharts';
import ProductsSummaryCards from '@/components/Products/ProductsSummaryCards';
import ProductsTable from '@/components/Products/ProductsTable';
import ProductSearchFilters from '@/components/Products/ProductSearchFilters';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import Header from '@/components/Dashboard/Header';

export interface ProductData {
  id: string; // Changed from number to string to match Supabase UUID
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
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);

  const handleSearch = (searchTerm: string) => {
    const filteredProducts = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filteredProducts);
  };

  const handleCategoryFilter = (category: string) => {
    if (category === '全部') {
      setProducts(mockProducts);
    } else {
      const filteredProducts = mockProducts.filter(product => product.category === category);
      setProducts(filteredProducts);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <OrdersSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4">
            <ProductsSummaryCards products={products} />
            <ProductSearchFilters onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />
            <ProductsCharts products={products} />
            <ProductsTable products={products} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
