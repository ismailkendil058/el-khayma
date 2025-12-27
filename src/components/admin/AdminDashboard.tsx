import { useMemo, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Wallet,
  DollarSign,
  Package,
  X
} from 'lucide-react';
import { format, isToday, isThisMonth, isThisYear, startOfDay, startOfMonth, startOfYear, eachDayOfInterval, endOfMonth, isSameDay, isSameMonth, eachMonthOfInterval, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DateFilter = 'today' | 'month' | 'year';
type ChartType = 'month' | 'year' | null;

export function AdminDashboard() {
  const { sales, expenses, products } = useAppStore();
  
  const [selectedMonthDate, setSelectedMonthDate] = useState(new Date());
  const [selectedYearDate, setSelectedYearDate] = useState(new Date());
  const [fullscreenChart, setFullscreenChart] = useState<ChartType>(null);

  const filterDates = useMemo(() => {
    const now = new Date();
    return {
      today: startOfDay(now),
      month: startOfMonth(now),
      year: startOfYear(now),
    };
  }, []);

  const getFilteredData = (filter: DateFilter) => {
    const checkFn = filter === 'today' ? isToday : filter === 'month' ? isThisMonth : isThisYear;
    
    const filteredSales = sales.filter((s) => checkFn(new Date(s.createdAt)));
    const filteredExpenses = expenses.filter((e) => checkFn(new Date(e.date)));
    
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
    const netProfit = totalProfit - totalExpenses;
    
    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: totalProfit,
      net: netProfit,
      salesCount: filteredSales.length,
    };
  };

  const todayData = getFilteredData('today');
  const monthData = getFilteredData('month');
  const yearData = getFilteredData('year');

  const monthChartData = useMemo(() => {
    const monthStart = startOfMonth(selectedMonthDate);
    const monthEnd = endOfMonth(selectedMonthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const daySales = sales.filter(s => isSameDay(new Date(s.createdAt), day));
      const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), day));
      
      const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      const exp = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      const net = daySales.reduce((sum, s) => sum + s.totalProfit, 0) - exp;
      
      return {
        date: format(day, 'dd MMM'),
        revenue,
        net,
      };
    });
  }, [sales, expenses, selectedMonthDate]);

  const yearChartData = useMemo(() => {
    const yearStart = startOfYear(selectedYearDate);
    const yearEnd = endOfYear(selectedYearDate);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    
    return months.map(month => {
      const monthSales = sales.filter(s => isSameMonth(new Date(s.createdAt), month));
      const monthExpenses = expenses.filter(e => isSameMonth(new Date(e.date), month));
      
      const revenue = monthSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const exp = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const net = monthSales.reduce((sum, s) => sum + s.totalProfit, 0) - exp;
      
      return {
        date: format(month, 'MMM'),
        revenue,
        net,
      };
    });
  }, [sales, expenses, selectedYearDate]);

  const lowStockProducts = products.filter(
    (p) => p.isActive && p.stock <= p.lowStockThreshold
  );

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
    
    sales.filter((s) => isThisMonth(new Date(s.createdAt))).forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { name: item.productName, count: 0, revenue: 0 };
        }
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].revenue += item.priceCharged;
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  return (
    <AdminLayout>
      <div className="p-4 space-y-6">
        {/* Today Header */}
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
          <h2 className="text-2xl font-semibold text-foreground mt-1">
            Tableau de bord
          </h2>
        </div>

        {/* Today Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Aujourd'hui
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Chiffre d'affaires"
              value={`${todayData.revenue.toLocaleString()} DA`}
              icon={TrendingUp}
              trend={todayData.revenue > 0 ? 'up' : 'neutral'}
            />
            <MetricCard
              label="Bénéfice brut"
              value={`${todayData.profit.toLocaleString()} DA`}
              icon={DollarSign}
              trend={todayData.profit > 0 ? 'up' : 'neutral'}
            />
            <MetricCard
              label="Ventes"
              value={todayData.salesCount.toString()}
              icon={Receipt}
              trend="neutral"
            />
            <MetricCard
              label="Bénéfice net"
              value={`${todayData.net.toLocaleString()} DA`}
              icon={Wallet}
              trend={todayData.net > 0 ? 'up' : todayData.net < 0 ? 'down' : 'neutral'}
            />
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Ce mois
          </h3>
          
          <div className="bg-card rounded-2xl p-5 shadow-soft">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chiffre d'affaires</span>
                <span className="text-xl font-semibold text-foreground">
                  {monthData.revenue.toLocaleString()} DA
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Charges</span>
                <span className="text-lg font-medium text-destructive">
                  -{monthData.expenses.toLocaleString()} DA
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">Bénéfice net</span>
                <span className={`text-xl font-bold ${monthData.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {monthData.net.toLocaleString()} DA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ventes: Monthly & Yearly Benefits */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Ventes - Graphiques
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFullscreenChart('month')}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-lg transition hover:scale-105 border border-transparent hover:border-primary/30"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <TrendingUp className="w-8 h-8 text-success" />
                <span className="text-sm font-medium text-foreground">Graphique Mensuel</span>
                <span className="text-xs text-muted-foreground">
                  {format(selectedMonthDate, 'MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </button>

            <button
              onClick={() => setFullscreenChart('year')}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-lg transition hover:scale-105 border border-transparent hover:border-primary/30"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-foreground">Graphique Annuel</span>
                <span className="text-xs text-muted-foreground">
                  {selectedYearDate.getFullYear()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-warning uppercase tracking-wide flex items-center gap-2">
              <Package className="w-4 h-4" />
              Stock faible
            </h3>
            
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center justify-between"
                >
                  <span className="font-medium text-foreground">{product.name}</span>
                  <span className="text-warning font-semibold">
                    {product.sellingType === 'kilo'
                      ? `${product.stock.toFixed(1)} kg`
                      : `${Math.floor(product.stock)} unités`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Meilleurs produits (ce mois)
            </h3>
            
            <div className="bg-card rounded-2xl p-4 shadow-soft space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 h-6 bg-secondary rounded-lg flex items-center justify-center text-sm font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium text-foreground truncate">
                    {product.name}
                  </span>
                  <span className="text-muted-foreground">
                    {product.revenue.toLocaleString()} DA
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Chart Modal */}
        {fullscreenChart && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0">
            <div className="bg-card rounded-2xl w-full h-full md:h-[90vh] md:w-[90vw] shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                <h2 className="text-lg md:text-2xl font-bold text-foreground">
                  {fullscreenChart === 'month' ? 'Graphique Mensuel' : 'Graphique Annuel'}
                </h2>
                <button
                  onClick={() => setFullscreenChart(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-secondary/30">
                <button
                  onClick={() => fullscreenChart === 'month' 
                    ? setSelectedMonthDate(new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() - 1))
                    : setSelectedYearDate(new Date(selectedYearDate.getFullYear() - 1, 0))
                  }
                  className="p-2 hover:bg-secondary rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                
                <span className="text-sm md:text-base font-semibold text-foreground">
                  {fullscreenChart === 'month' 
                    ? format(selectedMonthDate, 'MMMM yyyy', { locale: fr })
                    : selectedYearDate.getFullYear()
                  }
                </span>
                
                <button
                  onClick={() => fullscreenChart === 'month' 
                    ? setSelectedMonthDate(new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1))
                    : setSelectedYearDate(new Date(selectedYearDate.getFullYear() + 1, 0))
                  }
                  className="p-2 hover:bg-secondary rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Chart Container */}
              <div className="flex-1 overflow-auto p-4 md:p-6">
                <ChartContainer config={{
                  revenue: { label: 'Chiffre d\'affaires', color: 'hsl(var(--success))' },
                  net: { label: 'Bénéfice net', color: 'hsl(var(--primary))' },
                }} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fullscreenChart === 'month' ? monthChartData : yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip />
                      <ChartLegend />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="net" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${
          trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
        }`} />
        {trend !== 'neutral' && (
          trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )
        )}
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
