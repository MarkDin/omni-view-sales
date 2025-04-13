
import { ProductData } from '@/types/product';

export const calculateSummary = (products: ProductData[]) => {
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

export const calculateCategoryDistribution = (products: ProductData[]) => {
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
