import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Coffee, Plus, Minus } from 'lucide-react';

interface UnitQuantitySheetProps {
  product: Product;
  onConfirm: (quantity: number) => void;
  onClose: () => void;
}

export function UnitQuantitySheet({ product, onConfirm, onClose }: UnitQuantitySheetProps) {
  const [quantity, setQuantity] = useState(1);

  const maxQuantity = Math.floor(product.stock);

  const adjustQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + amount)));
  };

  const totalPrice = quantity * product.sellingPrice;

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
        <div className="flex items-center gap-3 mb-8 pt-4">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center">
            <Coffee className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
            <p className="text-muted-foreground">
              {product.sellingPrice} DA • {maxQuantity} disponibles
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="bg-secondary rounded-2xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Quantité
          </p>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
              className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-soft active:scale-95 disabled:opacity-50"
            >
              <Minus className="w-7 h-7" />
            </button>
            
            <span className="text-5xl font-bold text-foreground w-20 text-center">
              {quantity}
            </span>
            
            <button
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= maxQuantity}
              className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-soft active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">{totalPrice} DA</span>
        </div>

        {/* Confirm Button */}
        <Button
          variant="pos"
          size="xl"
          onClick={() => onConfirm(quantity)}
          className="w-full"
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
