import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { Product, CATEGORY_LABELS, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Scale, Coffee, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Produits</h2>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={cn(
                'bg-card rounded-2xl p-4 shadow-soft',
                !product.isActive && 'opacity-60'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                  {product.sellingType === 'kilo' ? (
                    <Scale className="w-6 h-6 text-primary" />
                  ) : (
                    <Coffee className="w-6 h-6 text-primary" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {product.name}
                    </h3>
                    {!product.isActive && (
                      <span className="text-2xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[product.category]} • {product.sellingType === 'kilo' ? 'Au kilo' : 'À l\'unité'}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Coût:</span>{' '}
                      <span className="font-medium">{product.costPrice} DA</span>
                    </span>
                    <span className="text-sm">
                      <span className="text-muted-foreground">Vente:</span>{' '}
                      <span className="font-medium text-primary">{product.sellingPrice} DA</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stock: {product.sellingType === 'kilo' 
                      ? `${product.stock.toFixed(1)} kg`
                      : `${Math.floor(product.stock)} unités`}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(product)}
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit</p>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleClose}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
              toast.success('Produit mis à jour');
            } else {
              addProduct(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
              toast.success('Produit ajouté');
            }
            handleClose();
          }}
          onDelete={editingProduct ? () => {
            deleteProduct(editingProduct.id);
            toast.success('Produit supprimé');
            handleClose();
          } : undefined}
        />
      )}
    </AdminLayout>
  );
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
  onDelete?: () => void;
}

function ProductForm({ product, onClose, onSave, onDelete }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'fruits_secs');
  const [sellingType, setSellingType] = useState<'kilo' | 'unit'>(product?.sellingType || 'kilo');
  const [costPrice, setCostPrice] = useState(product?.costPrice?.toString() || '');
  const [sellingPrice, setSellingPrice] = useState(product?.sellingPrice?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '');
  const [threshold, setThreshold] = useState(product?.lowStockThreshold?.toString() || '3');
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const handleSubmit = () => {
    if (!name || !costPrice || !sellingPrice) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    onSave({
      name,
      category,
      sellingType,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      stock: parseFloat(stock) || 0,
      lowStockThreshold: parseFloat(threshold) || 3,
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-3xl p-6 pb-safe animate-slide-up shadow-elevated max-h-[90vh] overflow-y-auto">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-foreground pt-4 mb-6">
          {product ? 'Modifier le produit' : 'Nouveau produit'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Catégorie</label>
            <div className="flex gap-2">
              {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium transition-all',
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Type de vente</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSellingType('kilo')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
                  sellingType === 'kilo'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                <Scale className="w-4 h-4" />
                Au kilo
              </button>
              <button
                onClick={() => setSellingType('unit')}
                className={cn(
                  'flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
                  sellingType === 'unit'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                <Coffee className="w-4 h-4" />
                À l'unité
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Prix de gros (DA)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Prix de vente (DA)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Stock {sellingType === 'kilo' ? '(kg)' : '(unités)'}
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Seuil d'alerte</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="3"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-secondary rounded-xl p-4">
            <span className="text-foreground">Produit actif</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={cn(
                'w-12 h-7 rounded-full transition-all relative',
                isActive ? 'bg-success' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all',
                  isActive ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>

          <Button onClick={handleSubmit} variant="pos" size="lg" className="w-full">
            {product ? 'Enregistrer' : 'Créer le produit'}
          </Button>

          {onDelete && (
            <Button onClick={onDelete} variant="ghost" size="lg" className="w-full text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer le produit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
