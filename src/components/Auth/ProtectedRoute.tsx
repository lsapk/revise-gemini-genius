
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - État:', { user: user?.email || 'Non connecté', loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          <span className="text-gray-600 dark:text-gray-400">Vérification de l'authentification...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 Accès refusé - redirection vers /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ Accès autorisé pour:', user.email);
  return <>{children}</>;
}
