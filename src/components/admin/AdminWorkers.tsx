import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { AdminLayout } from './AdminLayout';
import { Worker } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, X, Trash2, User, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AdminWorkers() {
  const { workers, addWorker, updateWorker, deleteWorker } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingWorker(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingWorker(null);
  };

  return (
    <AdminLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Employés</h2>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className={cn(
                'bg-card rounded-2xl p-4 shadow-soft',
                !worker.isActive && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {worker.name}
                    </h3>
                    {!worker.isActive && (
                      <span className="text-2xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Code: ****
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(worker)}
                  className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun employé</p>
          </div>
        )}
      </div>

      {showForm && (
        <WorkerForm
          worker={editingWorker}
          onClose={handleClose}
          onSave={(data) => {
            if (editingWorker) {
              updateWorker(editingWorker.id, data);
              toast.success('Employé mis à jour');
            } else {
              addWorker(data as Omit<Worker, 'id' | 'createdAt'>);
              toast.success('Employé ajouté');
            }
            handleClose();
          }}
          onDelete={editingWorker ? () => {
            deleteWorker(editingWorker.id);
            toast.success('Employé supprimé');
            handleClose();
          } : undefined}
        />
      )}
    </AdminLayout>
  );
}

interface WorkerFormProps {
  worker: Worker | null;
  onClose: () => void;
  onSave: (data: Partial<Worker>) => void;
  onDelete?: () => void;
}

function WorkerForm({ worker, onClose, onSave, onDelete }: WorkerFormProps) {
  const [name, setName] = useState(worker?.name || '');
  const [password, setPassword] = useState(worker?.password || '');
  const [isActive, setIsActive] = useState(worker?.isActive ?? true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!name || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    if (password.length < 4) {
      toast.error('Le mot de passe doit avoir au moins 4 caractères');
      return;
    }
    
    onSave({
      name,
      password,
      isActive,
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
          {worker ? 'Modifier l\'employé' : 'Nouvel employé'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Nom de l'employé"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Mot de passe POS</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 bg-secondary rounded-xl border-none text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Code à 4+ chiffres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-secondary rounded-xl p-4">
            <span className="text-foreground">Compte actif</span>
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
            {worker ? 'Enregistrer' : 'Créer l\'employé'}
          </Button>

          {onDelete && (
            <Button onClick={onDelete} variant="ghost" size="lg" className="w-full text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer l'employé
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
