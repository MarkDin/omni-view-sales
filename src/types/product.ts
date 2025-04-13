
export interface ProductData {
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

export interface Summary {
  totalRevenue: number;
  totalProducts: number;
  totalProfit: number;
  avgMargin: number;
}

export interface CategoryCount {
  name: string;
  value: number;
}
