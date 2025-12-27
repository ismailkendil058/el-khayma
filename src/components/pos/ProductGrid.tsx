import { useState } from 'react';
import { Product, CATEGORY_LABELS, ProductCategory } from '@/types';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { Scale, Coffee, AlertTriangle } from 'lucide-react';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ onProductSelect }: ProductGridProps) {
  const { products } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const activeProducts = products.filter((p) => p.isActive);
  const filteredProducts = selectedCategory === 'all'
    ? activeProducts
    : activeProducts.filter((p) => p.category === selectedCategory);

  const categories: (ProductCategory | 'all')[] = ['all', 'fruits_secs', 'boissons', 'autres'];
  const categoryLabels: Record<ProductCategory | 'all', string> = {
    all: 'Tous',
    ...CATEGORY_LABELS,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category Tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-card text-muted-foreground hover:bg-secondary'
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => onProductSelect(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Coffee className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucun produit disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
}

function ProductCard({ product, onSelect }: ProductCardProps) {
  const isLowStock = product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  return (
    <button
      onClick={onSelect}
      disabled={isOutOfStock}
      className={cn(
        'product-card text-left relative overflow-hidden',
        isOutOfStock && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Low Stock Indicator */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 right-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
        </div>
      )}

      {/* Product Icon */}
      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-3">
        {product.sellingType === 'kilo' ? (
          <Scale className="w-6 h-6 text-primary" />
        ) : (
          <Coffee className="w-6 h-6 text-primary" />
        )}
      </div>

      {/* Product Info */}
      <h3 className="font-semibold text-foreground truncate mb-1">
        {product.name}
      </h3>
      
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-primary">
          {product.sellingPrice}
        </span>
        <span className="text-xs text-muted-foreground">
          DA{product.sellingType === 'kilo' ? '/kg' : ''}
        </span>
      </div>

      {/* Stock Info */}
      <p className="text-xs text-muted-foreground mt-2">
        {product.sellingType === 'kilo' 
          ? `${product.stock.toFixed(1)} kg`
          : `${Math.floor(product.stock)} unités`}
      </p>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
          <span className="text-sm font-medium text-destructive">Épuisé</span>
        </div>
      )}
    </button>
  );
}
