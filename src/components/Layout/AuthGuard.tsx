import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, BookOpen, Brain, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Connexion requise</CardTitle>
            <CardDescription className="text-base">
              Connectez-vous pour accéder à vos cours et gérer votre contenu d'apprentissage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Mes cours</p>
                  <p className="text-sm text-muted-foreground">Organisez vos matières</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <Brain className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">IA d'apprentissage</p>
                  <p className="text-sm text-muted-foreground">QCM et flashcards automatiques</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Suivi des progrès</p>
                  <p className="text-sm text-muted-foreground">Statistiques personnalisées</p>
                </div>
              </div>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link to="/auth" state={{ from: location }}>
                Se connecter
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}