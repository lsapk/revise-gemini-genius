
import { useEffect, useState } from 'react';
import { ResponsiveLayout } from '@/components/Layout/ResponsiveLayout';
import { ModernQuickActions } from '@/components/Home/ModernQuickActions';
import { ModernSubjectCard } from '@/components/Home/ModernSubjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { BookOpen, TrendingUp, Clock, Trophy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Index() {
  const { subjects, stats, deleteSubject } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteSubject(subjectId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleEditSubject = (subject: any) => {
    const newName = prompt('Nouveau nom de la matière:', subject.name);
    if (newName && newName.trim()) {
      console.log('Modification de la matière:', subject.id, newName);
    }
  };

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bienvenue sur ReviseGenius
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Révision intelligente avec IA - Optimisez votre apprentissage grâce à des outils personnalisés
          </p>
        </div>

        {/* Actions rapides */}
        <ModernQuickActions />

        {/* Statistiques globales */}
        {stats.sessionsCompleted > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Vos statistiques de révision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-600">{stats.totalStudyTime}min</p>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                  <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-green-600">{Math.round(stats.averageScore)}%</p>
                  <p className="text-sm text-muted-foreground">Score moyen</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-purple-600">{stats.sessionsCompleted}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <BookOpen className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-orange-600">{subjects.length}</p>
                  <p className="text-sm text-muted-foreground">Matières</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mes matières */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mes matières</h2>
              <p className="text-muted-foreground">
                Gérez et révisez vos cours efficacement
              </p>
            </div>
            {subjects.length > 0 && (
              <Button asChild>
                <Link to="/add" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Link>
              </Button>
            )}
          </div>

          {subjects.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-12">
                <BookOpen className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">
                  Commencez votre parcours d'apprentissage
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Ajoutez votre première matière pour débuter vos révisions intelligentes avec l'IA.
                </p>
                <Button asChild size="lg">
                  <Link to="/add" className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Ajouter ma première matière
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <ModernSubjectCard
                  key={subject.id}
                  subject={subject}
                  stats={stats.subjectStats?.[subject.id]}
                  onDelete={handleDeleteSubject}
                  onEdit={handleEditSubject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}
