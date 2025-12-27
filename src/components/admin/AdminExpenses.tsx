import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { Expense, EXPENSE_LABELS, ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, X, Trash2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function AdminExpenses() {
  const { expenses, addExpense, deleteExpense } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Charges</h2>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {/* Total */}
        <div className="bg-card rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-5 h-5 text-destructive" />
            <span className="text-muted-foreground">Total des charges</span>
          </div>
          <p className="text-2xl font-bold text-destructive">
            {totalExpenses.toLocaleString()} DA
          </p>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <div key={expense.id} className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    {EXPENSE_LABELS[expense.category]}
                  </h3>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground">{expense.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(expense.date), 'd MMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-destructive">
                    -{expense.amount.toLocaleString()} DA
                  </span>
                  <button
                    onClick={() => {
                      deleteExpense(expense.id);
                      toast.success('Charge supprimée');
                    }}
                    className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {expenses.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune charge enregistrée</p>
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onClose={() => setShowForm(false)}
          onSave={(data) => {
            addExpense(data);
            toast.success('Charge ajoutée');
            setShowForm(false);
          }}
        />
      )}
    </AdminLayout>
  );
}

interface ExpenseFormProps {
  onClose: () => void;
  onSave: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
}

function ExpenseForm({ onClose, onSave }: ExpenseFormProps) {
  const [category, setCategory] = useState<ExpenseCategory>('rent');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleSubmit = () => {
    if (!amount) {
      toast.error('Veuillez entrer un montant');
      return;
    }
    
    onSave({
      category,
      amount: parseFloat(amount),
      description: description || undefined,
      date: new Date(date),
    });
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-3xl p-6 pb-safe animate-slide-up shadow-elevated">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-foreground pt-4 mb-6">
          Nouvelle charge
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Catégorie</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(EXPENSE_LABELS) as ExpenseCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'py-2.5 rounded-xl text-sm font-medium transition-all',
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  {EXPENSE_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Montant (DA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Description (optionnel)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Notes..."
            />
          </div>

          <Button onClick={handleSubmit} variant="pos" size="lg" className="w-full">
            Ajouter la charge
          </Button>
        </div>
      </div>
    </div>
  );
}
