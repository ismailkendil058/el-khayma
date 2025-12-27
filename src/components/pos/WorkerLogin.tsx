import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { Lock, Delete } from 'lucide-react';

export function WorkerLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { verifyWorkerPassword, setCurrentWorker } = useAppStore();

  const handleNumberClick = (num: string) => {
    if (password.length < 6) {
      setPassword((prev) => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPassword((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPassword('');
    setError('');
  };

  const handleSubmit = () => {
    const worker = verifyWorkerPassword(password);
    if (worker) {
      setCurrentWorker(worker);
      setPassword('');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-safe">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Salon de Thé
        </h1>
        <p className="text-muted-foreground">
          Entrez votre code pour commencer
        </p>
      </div>

      {/* Password Display */}
      <div className="flex gap-3 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < password.length
                ? 'bg-primary scale-110'
                : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-destructive text-sm mb-4 animate-fade-in">
          {error}
        </p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-8">
        {numbers.map((num, i) => {
          if (num === '') {
            return <div key={i} />;
          }
          if (num === 'del') {
            return (
              <button
                key={i}
                onClick={handleDelete}
                onDoubleClick={handleClear}
                className="h-16 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors active:scale-95"
              >
                <Delete className="w-6 h-6" />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => handleNumberClick(num)}
              className="h-16 rounded-2xl bg-card text-2xl font-medium text-foreground hover:bg-secondary transition-all shadow-soft active:scale-95"
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={password.length < 4}
        variant="pos"
        size="xl"
        className="w-full max-w-xs"
      >
        Commencer
      </Button>

      {/* Demo hint */}
      <p className="text-xs text-muted-foreground mt-8 text-center">
        Codes démo: 1234 (Ahmed) ou 5678 (Youssef)
      </p>
    </div>
  );
}
