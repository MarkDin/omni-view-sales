
import React from 'react';
import { Package } from 'lucide-react';

interface Summary {
  totalRevenue: number;
  totalProducts: number;
  totalProfit: number;
  avgMargin: number;
}

interface ProductsSummaryCardsProps {
  summary: Summary;
}

const ProductsSummaryCards: React.FC<ProductsSummaryCardsProps> = ({ summary }) => {
  return (
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
  );
};

export default ProductsSummaryCards;
