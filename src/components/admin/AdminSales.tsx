import { useMemo, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { format, isToday, startOfDay, endOfDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Receipt, TrendingUp, User } from 'lucide-react';

export function AdminSales() {
  const { sales } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const filteredSales = useMemo(() => {
    const date = parseISO(selectedDate);
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    return sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sales, selectedDate]);

  const dayStats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
    return { revenue: totalRevenue, profit: totalProfit, count: filteredSales.length };
  }, [filteredSales]);

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Historique des ventes</h2>

        {/* Date Picker */}
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <Receipt className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{dayStats.count}</p>
            <p className="text-2xs text-muted-foreground">Ventes</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <TrendingUp className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{dayStats.revenue.toLocaleString()}</p>
            <p className="text-2xs text-muted-foreground">CA (DA)</p>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-soft text-center">
            <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-success">{dayStats.profit.toLocaleString()}</p>
            <p className="text-2xs text-muted-foreground">Profit (DA)</p>
          </div>
        </div>

        {/* Sales List */}
        <div className="space-y-3">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{sale.workerName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(sale.createdAt), 'HH:mm')}
                </span>
              </div>
              
              <div className="space-y-1.5 mb-3">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.productName}
                      <span className="text-2xs ml-1">
                        ({item.quantity.toFixed(item.quantity % 1 === 0 ? 0 : 2)})
                      </span>
                    </span>
                    <span className="text-foreground">{item.priceCharged} DA</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Total</span>
                <div className="text-right">
                  <span className="font-bold text-foreground">{sale.totalAmount} DA</span>
                  <span className="text-sm text-success ml-2">+{sale.totalProfit.toFixed(0)} DA</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune vente pour cette date</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
