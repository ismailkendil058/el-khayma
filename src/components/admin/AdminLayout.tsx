import { ReactNode } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  Wallet,
  LogOut,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/admin/products', icon: Package, label: 'Produits' },
  { path: '/admin/workers', icon: Users, label: 'Employés' },
  { path: '/admin/sales', icon: Receipt, label: 'Ventes' },
  { path: '/admin/expenses', icon: Wallet, label: 'Charges' },
  { path: '/admin/performance', icon: BarChart3, label: 'Performance' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { adminLogout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 pt-safe sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground">Administration</h1>
            <p className="text-sm text-muted-foreground">Salon de Thé</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className="text-2xs font-medium">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
