
import React, { useState } from 'react';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import ProductDrilldownModal from '@/components/Dashboard/ProductDrilldownModal';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { ProductData } from '@/types/product';
import { calculateSummary, calculateCategoryDistribution } from '@/components/Products/ProductUtils';
import ProductsSummaryCards from '@/components/Products/ProductsSummaryCards';
import ProductsCharts from '@/components/Products/ProductsCharts';
import ProductSearchFilters from '@/components/Products/ProductSearchFilters';
import ProductsTable from '@/components/Products/ProductsTable';

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

  const summary = calculateSummary(products);
  const categoryData = calculateCategoryDistribution(products);

  const filteredProducts = products.filter(product => {
    if (!product.name || !product.category) return false;
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: ProductData) => {
    // Ensure a valid product object with required fields before setting it
    if (product && product.name && product.category) {
      setSelectedProduct(product);
      setIsDrilldownOpen(true);
    } else {
      console.warn('Attempted to open drilldown with an invalid product:', product);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setIsFiltering(false);
  };

  // Safely get unique categories, filtering out products with no category
  const uniqueCategories = Array.from(
    new Set(
      products
        .filter(product => product && product.category) // Make sure product and category exists
        .map(product => product.category)
    )
  );

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
        
        <ProductsSummaryCards summary={summary} />
        
        <ProductsCharts products={products} categoryData={categoryData} />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h3 className="text-lg font-medium mb-4 md:mb-0">产品列表</h3>
            
            <ProductSearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              isFiltering={isFiltering}
              setIsFiltering={setIsFiltering}
              uniqueCategories={uniqueCategories}
              clearFilters={clearFilters}
            />
          </div>
          
          <ProductsTable products={filteredProducts} handleProductClick={handleProductClick} />
        </div>
        
        {/* Only render the modal when there's a valid selected product */}
        {selectedProduct && (
          <ProductDrilldownModal 
            open={isDrilldownOpen} 
            onClose={() => setIsDrilldownOpen(false)}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
