import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { X, Trash2, CheckCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface CartSheetProps {
  onClose: () => void;
}

export function CartSheet({ onClose }: CartSheetProps) {
  const { cart, removeFromCart, getCartTotal, completeSale, currentWorker } = useAppStore();

  const total = getCartTotal();

  const handleCompleteSale = () => {
    const sale = completeSale();
    if (sale) {
      toast.success('Vente enregistrée', {
        description: `Total: ${sale.totalAmount} DA`,
        icon: <CheckCircle className="w-5 h-5" />,
      });
      onClose();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
        <div 
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full bg-card rounded-t-3xl p-6 pb-safe animate-slide-up shadow-elevated">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Le panier est vide</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-safe animate-slide-up shadow-elevated max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pt-4 mb-4">
          <h2 className="text-xl font-semibold text-foreground">Panier</h2>
          <p className="text-muted-foreground text-sm">
            {currentWorker?.name} • {cart.length} article{cart.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 mb-4">
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-secondary rounded-xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.product.sellingType === 'kilo'
                      ? `${(item.priceCharged / item.product.sellingPrice).toFixed(2)} kg`
                      : `${item.quantity} unité${item.quantity > 1 ? 's' : ''}`}
                  </p>
                </div>
                <span className="font-semibold text-foreground">
                  {item.priceCharged} DA
                </span>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-lg text-muted-foreground">Total</span>
            <span className="text-3xl font-bold text-foreground">{total} DA</span>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          variant="pos"
          size="xl"
          onClick={handleCompleteSale}
          className="w-full"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Valider la vente
        </Button>
      </div>
    </div>
  );
}
