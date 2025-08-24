
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
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
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
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bienvenue sur ReviseGenius
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Révision intelligente avec IA - Optimisez votre apprentissage grâce à des outils personnalisés et adaptatifs
          </p>
        </div>

        {/* Actions rapides */}
        <ModernQuickActions />

        {/* Statistiques globales */}
        {stats.sessionsCompleted > 0 && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <TrendingUp className="w-6 h-6 text-primary" />
                Vos statistiques de révision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalStudyTime}min</p>
                  <p className="text-sm font-medium text-blue-600/70">Temps total</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-2xl border border-green-200 dark:border-green-800">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-green-600 mb-2">{Math.round(stats.averageScore)}%</p>
                  <p className="text-sm font-medium text-green-600/70">Score moyen</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-purple-600 mb-2">{stats.sessionsCompleted}</p>
                  <p className="text-sm font-medium text-purple-600/70">Sessions</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-2xl border border-orange-200 dark:border-orange-800">
                  <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-orange-600 mb-2">{subjects.length}</p>
                  <p className="text-sm font-medium text-orange-600/70">Matières</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mes matières */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Mes matières</h2>
              <p className="text-muted-foreground text-lg">
                Gérez et révisez vos cours efficacement
              </p>
            </div>
            {subjects.length > 0 && (
              <Button asChild size="lg" className="shadow-lg">
                <Link to="/add" className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Ajouter une matière
                </Link>
              </Button>
            )}
          </div>

          {subjects.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/25 bg-gradient-to-br from-background to-muted/20">
              <CardContent className="text-center py-16">
                <BookOpen className="w-24 h-24 text-muted-foreground/50 mx-auto mb-8" />
                <h3 className="text-2xl font-semibold mb-4">
                  Commencez votre parcours d'apprentissage
                </h3>
                <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg leading-relaxed">
                  Ajoutez votre première matière pour débuter vos révisions intelligentes avec l'IA.
                </p>
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/add" className="flex items-center gap-3">
                    <Plus className="w-5 h-5" />
                    Ajouter ma première matière
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
