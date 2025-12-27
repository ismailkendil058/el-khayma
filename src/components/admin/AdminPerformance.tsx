import { useMemo, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { WorkerPerformance } from '@/types';
import { format, isToday, startOfDay, endOfDay, parseISO, startOfMonth, endOfMonth, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, TrendingUp, Receipt, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminPerformance() {
  const { sales, workers } = useAppStore();
  const [viewMode, setViewMode] = useState<'today' | 'month'>('today');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const workerPerformance = useMemo(() => {
    const date = parseISO(selectedDate);
    let start: Date, end: Date;
    
    if (viewMode === 'today') {
      start = startOfDay(date);
      end = endOfDay(date);
    } else {
      start = startOfMonth(date);
      end = endOfMonth(date);
    }

    const filteredSales = sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    });

    const performanceMap: Record<string, WorkerPerformance> = {};

    workers.forEach((worker) => {
      performanceMap[worker.id] = {
        workerId: worker.id,
        workerName: worker.name,
        totalSales: 0,
        totalRevenue: 0,
        totalProfit: 0,
        transactionCount: 0,
      };
    });

    filteredSales.forEach((sale) => {
      if (performanceMap[sale.workerId]) {
        performanceMap[sale.workerId].totalRevenue += sale.totalAmount;
        performanceMap[sale.workerId].totalProfit += sale.totalProfit;
        performanceMap[sale.workerId].transactionCount += 1;
      }
    });

    return Object.values(performanceMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [sales, workers, selectedDate, viewMode]);

  const totalStats = useMemo(() => {
    return workerPerformance.reduce(
      (acc, perf) => ({
        revenue: acc.revenue + perf.totalRevenue,
        profit: acc.profit + perf.totalProfit,
        transactions: acc.transactions + perf.transactionCount,
      }),
      { revenue: 0, profit: 0, transactions: 0 }
    );
  }, [workerPerformance]);

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Performance des employés</h2>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('today')}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
              viewMode === 'today'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground shadow-soft'
            )}
          >
            Journée
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
              viewMode === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground shadow-soft'
            )}
          >
            Mois
          </button>
        </div>

        {/* Date Picker */}
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <input
            type={viewMode === 'month' ? 'month' : 'date'}
            value={viewMode === 'month' ? selectedDate.substring(0, 7) : selectedDate}
            onChange={(e) => setSelectedDate(viewMode === 'month' ? `${e.target.value}-01` : e.target.value)}
            className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Total Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <Receipt className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{totalStats.transactions}</p>
            <p className="text-2xs text-muted-foreground">Ventes</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <TrendingUp className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{totalStats.revenue.toLocaleString()}</p>
            <p className="text-2xs text-muted-foreground">CA (DA)</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <DollarSign className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-success">{totalStats.profit.toLocaleString()}</p>
            <p className="text-2xs text-muted-foreground">Profit (DA)</p>
          </div>
        </div>

        {/* Worker Performance List */}
        <div className="space-y-3">
          {workerPerformance.map((perf, index) => (
            <div key={perf.workerId} className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  {index < 3 && perf.transactionCount > 0 && (
                    <span className={cn(
                      'absolute -top-1 -right-1 w-5 h-5 rounded-full text-2xs font-bold flex items-center justify-center',
                      index === 0 && 'bg-yellow-400 text-yellow-900',
                      index === 1 && 'bg-gray-300 text-gray-700',
                      index === 2 && 'bg-amber-600 text-amber-100'
                    )}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{perf.workerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {perf.transactionCount} vente{perf.transactionCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Chiffre d'affaires</p>
                  <p className="text-lg font-bold text-foreground">
                    {perf.totalRevenue.toLocaleString()} DA
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Bénéfice généré</p>
                  <p className="text-lg font-bold text-success">
                    {perf.totalProfit.toLocaleString()} DA
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {workerPerformance.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun employé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
