
import { ProductData, Summary, CategoryCount } from '@/types/product';

export const calculateSummary = (products: ProductData[]): Summary => {
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalMargin = 0;
  let marginCount = 0;
  
  products.forEach(product => {
    // Only add values if they exist
    if (product && product.sales) totalRevenue += product.sales;
    if (product && product.profit) totalProfit += product.profit;
    if (product && product.margin) {
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

export const calculateCategoryDistribution = (products: ProductData[]): CategoryCount[] => {
  const categoryCounts: Record<string, number> = {};
  
  products.forEach(product => {
    // Skip products without a category
    if (!product || !product.category) return;
    
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
