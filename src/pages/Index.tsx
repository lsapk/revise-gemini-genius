
import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ModernQuickActions } from '@/components/Home/ModernQuickActions';
import { ModernSubjectCard } from '@/components/Home/ModernSubjectCard';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { useApp } from '@/contexts/AppContext';
import { storage, Subject } from '@/lib/storage';
import { BookOpen, TrendingUp, Clock, Trophy } from 'lucide-react';

export default function Index() {
  const { subjects, stats, refreshSubjects, refreshStats } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshSubjects();
    refreshStats();
    setIsLoading(false);
  }, [refreshSubjects, refreshStats]);

  const handleDeleteSubject = (subjectId: string) => {
    try {
      storage.deleteSubject(subjectId);
      refreshSubjects();
      refreshStats();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleEditSubject = (subject: Subject) => {
    // TODO: Ouvrir un modal d'édition
    const newName = prompt('Nouveau nom de la matière:', subject.name);
    if (newName && newName.trim()) {
      try {
        storage.updateSubject(subject.id, { name: newName.trim() });
        refreshSubjects();
      } catch (error) {
        console.error('Erreur lors de la modification:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Actions rapides */}
        <ModernQuickActions />

        {/* Statistiques globales */}
        {stats.sessionsCompleted > 0 && (
          <ModernCard>
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Vos statistiques
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-blue-600">{stats.totalStudyTime}min</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Temps total</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <Trophy className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-600">{Math.round(stats.averageScore)}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Score moyen</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-purple-600">{stats.sessionsCompleted}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sessions</p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                  <BookOpen className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-orange-600">{subjects.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Matières</p>
                </div>
              </div>
            </ModernCardContent>
          </ModernCard>
        )}

        {/* Mes matières */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Mes matières
            </h2>
            {subjects.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {subjects.length} matière{subjects.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {subjects.length === 0 ? (
            <ModernCard>
              <ModernCardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucune matière pour le moment
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Commencez par ajouter votre premier cours pour débuter vos révisions.
                </p>
              </ModernCardContent>
            </ModernCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subjects.map((subject) => (
                <ModernSubjectCard
                  key={subject.id}
                  subject={subject}
                  stats={stats.subjectStats[subject.id]}
                  onDelete={handleDeleteSubject}
                  onEdit={handleEditSubject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
