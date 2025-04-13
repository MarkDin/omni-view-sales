
import React from 'react';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { ProductData } from '@/types/product';
import { calculateSummary } from '@/components/Products/ProductUtils';
import { MetricCard } from '@/components/Analytics/MetricCard';

interface ProductsSummaryCardsProps {
  products: ProductData[];
}

const ProductsSummaryCards: React.FC<ProductsSummaryCardsProps> = ({ products }) => {
  const summary = calculateSummary(products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard
        title="总销售额"
        value={`¥${summary.totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="text-purple-500" />}
      />
      
      <MetricCard
        title="产品总数"
        value={summary.totalProducts}
        icon={<Package className="text-blue-500" />}
      />
      
      <MetricCard
        title="总利润"
        value={`¥${summary.totalProfit.toLocaleString()}`}
        icon={<ShoppingCart className="text-green-500" />}
      />
      
      <MetricCard
        title="平均利润率"
        value={`${summary.avgMargin}%`}
        icon={<TrendingUp className="text-orange-500" />}
      />
    </div>
  );
};

export default ProductsSummaryCards;
