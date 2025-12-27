import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Product } from '@/types';
import { ProductGrid } from './ProductGrid';
import { KiloPriceSheet } from './KiloPriceSheet';
import { UnitQuantitySheet } from './UnitQuantitySheet';
import { CartSheet } from './CartSheet';
import { WorkerLogin } from './WorkerLogin';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogOut, History } from 'lucide-react';
import { toast } from 'sonner';

export function POSInterface() {
  const { currentWorker, setCurrentWorker, addToCart, cart, getCartTotal } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  if (!currentWorker) {
    return <WorkerLogin />;
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleKiloConfirm = (price: number) => {
    if (selectedProduct) {
      const quantity = price / selectedProduct.sellingPrice;
      addToCart({
        product: selectedProduct,
        quantity,
        priceCharged: price,
      });
      toast.success(`${selectedProduct.name} ajouté`, {
        description: `${price} DA`,
      });
      setSelectedProduct(null);
    }
  };

  const handleUnitConfirm = (quantity: number) => {
    if (selectedProduct) {
      const price = quantity * selectedProduct.sellingPrice;
      addToCart({
        product: selectedProduct,
        quantity,
        priceCharged: price,
      });
      toast.success(`${selectedProduct.name} ajouté`, {
        description: `${quantity} × ${selectedProduct.sellingPrice} DA = ${price} DA`,
      });
      setSelectedProduct(null);
    }
  };

  const handleLogout = () => {
    setCurrentWorker(null);
  };

  const cartTotal = getCartTotal();
  const cartCount = cart.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3 pt-safe sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground">Salon de Thé</h1>
            <p className="text-sm text-muted-foreground">{currentWorker.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <History className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="flex-1 overflow-hidden">
        <ProductGrid onProductSelect={handleProductSelect} />
      </main>

      {/* Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 pb-safe animate-slide-up">
          <Button
            variant="pos"
            size="xl"
            onClick={() => setShowCart(true)}
            className="w-full relative shadow-elevated"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Voir le panier
            <span className="ml-2 px-2.5 py-0.5 bg-primary-foreground/20 rounded-lg text-sm">
              {cartTotal} DA
            </span>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </Button>
        </div>
      )}

      {/* Product Selection Sheets */}
      {selectedProduct && selectedProduct.sellingType === 'kilo' && (
        <KiloPriceSheet
          product={selectedProduct}
          onConfirm={handleKiloConfirm}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {selectedProduct && selectedProduct.sellingType === 'unit' && (
        <UnitQuantitySheet
          product={selectedProduct}
          onConfirm={handleUnitConfirm}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Cart Sheet */}
      {showCart && <CartSheet onClose={() => setShowCart(false)} />}
    </div>
  );
}
