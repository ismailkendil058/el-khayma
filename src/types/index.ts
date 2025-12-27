// Product Types
export type SellingType = 'kilo' | 'unit';
export type ProductCategory = 'fruits_secs' | 'boissons' | 'autres';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  costPrice: number; // Prix de gros
  sellingType: SellingType;
  sellingPrice: number; // Per kilo or per unit
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Worker Types
export interface Worker {
  id: string;
  name: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
}

// Sale Types
export interface CartItem {
  product: Product;
  quantity: number; // Units or weight in kg
  priceCharged: number;
}

export interface Sale {
  id: string;
  workerId: string;
  workerName: string;
  items: SaleItem[];
  totalAmount: number;
  totalProfit: number;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceCharged: number;
  costPrice: number;
  profit: number;
}

// Expense Types
export type ExpenseCategory = 'rent' | 'electricity' | 'water' | 'salaries' | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  date: Date;
  createdAt: Date;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalSales: number;
  topProducts: { name: string; count: number; revenue: number }[];
}

// Worker Performance
export interface WorkerPerformance {
  workerId: string;
  workerName: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  transactionCount: number;
}

// Category Labels
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  fruits_secs: 'Fruits Secs',
  boissons: 'Boissons',
  autres: 'Autres',
};

export const EXPENSE_LABELS: Record<ExpenseCategory, string> = {
  rent: 'Loyer',
  electricity: 'Électricité',
  water: 'Eau',
  salaries: 'Salaires',
  other: 'Autres',
};

// Quick prices for kilo products (in DA)
export const QUICK_PRICES = [70, 100, 150, 200, 250, 300];
