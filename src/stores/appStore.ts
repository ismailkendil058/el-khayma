import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Worker, Sale, Expense, CartItem, SaleItem } from '@/types';

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Workers
  workers: Worker[];
  addWorker: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  verifyWorkerPassword: (password: string) => Worker | null;

  // Current Session
  currentWorker: Worker | null;
  setCurrentWorker: (worker: Worker | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Sales
  sales: Sale[];
  completeSale: () => Sale | null;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Demo data
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Pistaches',
    category: 'fruits_secs',
    costPrice: 2800,
    sellingType: 'kilo',
    sellingPrice: 3500,
    stock: 15,
    lowStockThreshold: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Kawkaw',
    category: 'fruits_secs',
    costPrice: 800,
    sellingType: 'kilo',
    sellingPrice: 1200,
    stock: 25,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Amandes',
    category: 'fruits_secs',
    costPrice: 2200,
    sellingType: 'kilo',
    sellingPrice: 2800,
    stock: 12,
    lowStockThreshold: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Thé Vert',
    category: 'boissons',
    costPrice: 80,
    sellingType: 'unit',
    sellingPrice: 150,
    stock: 50,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Café Noir',
    category: 'boissons',
    costPrice: 60,
    sellingType: 'unit',
    sellingPrice: 120,
    stock: 100,
    lowStockThreshold: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Noisettes',
    category: 'fruits_secs',
    costPrice: 1800,
    sellingType: 'kilo',
    sellingPrice: 2400,
    stock: 8,
    lowStockThreshold: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const demoWorkers: Worker[] = [
  { id: '1', name: 'Ahmed', password: '1234', isActive: true, createdAt: new Date() },
  { id: '2', name: 'Youssef', password: '5678', isActive: true, createdAt: new Date() },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Products
      products: demoProducts,
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Workers
      workers: demoWorkers,
      addWorker: (worker) =>
        set((state) => ({
          workers: [
            ...state.workers,
            { ...worker, id: generateId(), createdAt: new Date() },
          ],
        })),
      updateWorker: (id, updates) =>
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),
      deleteWorker: (id) =>
        set((state) => ({
          workers: state.workers.filter((w) => w.id !== id),
        })),
      verifyWorkerPassword: (password) => {
        const worker = get().workers.find(
          (w) => w.password === password && w.isActive
        );
        return worker || null;
      },

      // Current Session
      currentWorker: null,
      setCurrentWorker: (worker) => set({ currentWorker: worker }),

      // Cart
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (c) => c.product.id === item.product.id
          );
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.product.id === item.product.id
                  ? { ...c, quantity: c.quantity + item.quantity, priceCharged: c.priceCharged + item.priceCharged }
                  : c
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      updateCartItem: (productId, updates) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            c.product.id === productId ? { ...c, ...updates } : c
          ),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.product.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((sum, item) => sum + item.priceCharged, 0);
      },

      // Sales
      sales: [],
      completeSale: () => {
        const state = get();
        if (!state.currentWorker || state.cart.length === 0) return null;

        const saleItems: SaleItem[] = state.cart.map((item) => {
          const costForQuantity = item.product.sellingType === 'kilo'
            ? (item.priceCharged / item.product.sellingPrice) * item.product.costPrice
            : item.quantity * item.product.costPrice;
          
          return {
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            priceCharged: item.priceCharged,
            costPrice: item.product.costPrice,
            profit: item.priceCharged - costForQuantity,
          };
        });

        const totalAmount = saleItems.reduce((sum, item) => sum + item.priceCharged, 0);
        const totalProfit = saleItems.reduce((sum, item) => sum + item.profit, 0);

        const sale: Sale = {
          id: generateId(),
          workerId: state.currentWorker.id,
          workerName: state.currentWorker.name,
          items: saleItems,
          totalAmount,
          totalProfit,
          createdAt: new Date(),
        };

        // Update stock
        const updatedProducts = state.products.map((product) => {
          const cartItem = state.cart.find((c) => c.product.id === product.id);
          if (cartItem) {
            const deduction = product.sellingType === 'kilo'
              ? cartItem.priceCharged / product.sellingPrice
              : cartItem.quantity;
            return { ...product, stock: Math.max(0, product.stock - deduction) };
          }
          return product;
        });

        set({
          sales: [...state.sales, sale],
          products: updatedProducts,
          cart: [],
        });

        return sale;
      },

      // Expenses
      expenses: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: generateId(), createdAt: new Date() },
          ],
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      // Admin Auth
      isAdminAuthenticated: false,
      adminLogin: (password) => {
        if (password === 'admin123') {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'salon-the-storage',
      partialize: (state) => ({
        products: state.products,
        workers: state.workers,
        sales: state.sales,
        expenses: state.expenses,
      }),
    }
  )
);
