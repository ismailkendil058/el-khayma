import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import { AdminProducts } from "./components/admin/AdminProducts";
import { AdminWorkers } from "./components/admin/AdminWorkers";
import { AdminSales } from "./components/admin/AdminSales";
import { AdminExpenses } from "./components/admin/AdminExpenses";
import { AdminPerformance } from "./components/admin/AdminPerformance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/admin/sales" element={<AdminSales />} />
          <Route path="/admin/expenses" element={<AdminExpenses />} />
          <Route path="/admin/performance" element={<AdminPerformance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
