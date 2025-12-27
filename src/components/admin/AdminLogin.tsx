import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-safe">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Administration
          </h1>
          <p className="text-muted-foreground">
            Accès réservé au propriétaire
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Mot de passe"
              className="w-full h-14 px-5 bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">
              {error}
            </p>
          )}

          <Button type="submit" variant="pos" size="xl" className="w-full">
            Se connecter
          </Button>
        </form>

        {/* Demo hint */}
        <p className="text-xs text-muted-foreground mt-8 text-center">
          Mot de passe démo: admin123
        </p>

        {/* Back to POS */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="w-full mt-4 text-muted-foreground"
        >
          Retour au POS
        </Button>
      </div>
    </div>
  );
}
