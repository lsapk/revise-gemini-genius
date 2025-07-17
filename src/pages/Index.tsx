
import { Layout } from '@/components/Layout/Layout';
import { ModernSubjectCard } from '@/components/Home/ModernSubjectCard';
import { ModernQuickActions } from '@/components/Home/ModernQuickActions';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { useApp } from '@/contexts/AppContext';
import { Plus, Sparkles, BookOpen, TrendingUp, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { subjects, stats } = useApp();

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Message de bienvenue si pas de matières */}
        {subjects.length === 0 && (
          <div className="flex items-center justify-center min-h-[80vh] px-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-float">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Bienvenue sur ReviseGenius !
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                Révolutionnez votre apprentissage avec notre IA qui génère automatiquement des quiz, résumés et flashcards à partir de vos cours.
              </p>
              <Link to="/add">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Créer mon premier cours
                </Button>
              </Link>
            </div>
          </div>
        )}

        {subjects.length > 0 && (
          <div className="p-6 space-y-8">
            {/* Statistiques en haut */}
            {stats.sessionsCompleted > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ModernCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                  <ModernCardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-600">{stats.totalStudyTime}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Minutes étudiées</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                  <ModernCardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{Math.round(stats.averageScore)}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score moyen</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                  <ModernCardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-purple-600">{stats.sessionsCompleted}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                  <ModernCardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold text-orange-600">{subjects.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Matières</p>
                  </ModernCardContent>
                </ModernCard>
              </div>
            )}

            {/* Actions rapides */}
            <ModernQuickActions />

            {/* Mes matières */}
            <ModernCard>
              <ModernCardHeader>
                <div className="flex items-center justify-between">
                  <ModernCardTitle className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary-500" />
                    Mes matières
                  </ModernCardTitle>
                  <Link to="/add">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </Link>
                </div>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <ModernSubjectCard
                      key={subject.id}
                      subject={subject}
                      stats={stats.subjectStats[subject.id]}
                    />
                  ))}
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
