import { useState } from 'react';
import { Product, QUICK_PRICES } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Scale, Plus, Minus } from 'lucide-react';

interface KiloPriceSheetProps {
  product: Product;
  onConfirm: (price: number) => void;
  onClose: () => void;
}

export function KiloPriceSheet({ product, onConfirm, onClose }: KiloPriceSheetProps) {
  const [customPrice, setCustomPrice] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);

  const handleQuickPrice = (price: number) => {
    onConfirm(price);
  };

  const handleCustomPriceSubmit = () => {
    const price = parseInt(customPrice, 10);
    if (price > 0) {
      onConfirm(price);
    }
  };

  const adjustCustomPrice = (amount: number) => {
    const current = parseInt(customPrice, 10) || 0;
    const newValue = Math.max(0, current + amount);
    setCustomPrice(newValue.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-safe animate-slide-up shadow-elevated">
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
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
            <p className="text-muted-foreground">
              {product.sellingPrice} DA/kg • {product.stock.toFixed(1)} kg en stock
            </p>
          </div>
        </div>

        {!showCustom ? (
          <>
            {/* Quick Prices */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {QUICK_PRICES.map((price) => (
                <Button
                  key={price}
                  variant="quickPrice"
                  size="lg"
                  onClick={() => handleQuickPrice(price)}
                  className="h-16"
                >
                  {price} DA
                </Button>
              ))}
            </div>

            {/* Custom Price Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowCustom(true)}
              className="w-full"
            >
              Montant personnalisé
            </Button>
          </>
        ) : (
          <>
            {/* Custom Price Input */}
            <div className="bg-secondary rounded-2xl p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Montant en DA
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => adjustCustomPrice(-50)}
                  className="w-14 h-14 rounded-xl bg-card flex items-center justify-center shadow-soft active:scale-95"
                >
                  <Minus className="w-6 h-6" />
                </button>
                
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="0"
                  className="w-32 text-center text-3xl font-bold bg-transparent border-none focus:outline-none"
                  autoFocus
                />
                
                <button
                  onClick={() => adjustCustomPrice(50)}
                  className="w-14 h-14 rounded-xl bg-card flex items-center justify-center shadow-soft active:scale-95"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              
              {customPrice && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  ≈ {((parseInt(customPrice, 10) || 0) / product.sellingPrice).toFixed(2)} kg
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowCustom(false)}
                className="flex-1"
              >
                Retour
              </Button>
              <Button
                variant="pos"
                size="lg"
                onClick={handleCustomPriceSubmit}
                disabled={!customPrice || parseInt(customPrice, 10) <= 0}
                className="flex-1"
              >
                Confirmer
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
