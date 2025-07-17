
import { Layout } from '@/components/Layout/Layout';
import { SubjectCard } from '@/components/Home/SubjectCard';
import { QuickActions } from '@/components/Home/QuickActions';
import { RecentActivity } from '@/components/Home/RecentActivity';
import { useApp } from '@/contexts/AppContext';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { subjects, stats } = useApp();

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Message de bienvenue si pas de matières */}
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Bienvenue sur ReviseGenius !</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Commencez votre révision intelligente en ajoutant votre premier cours.
            </p>
            <Link to="/add">
              <Button size="lg" className="gradient-bg">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter mon premier cours
              </Button>
            </Link>
          </div>
        )}

        {/* Actions rapides */}
        {subjects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
            <QuickActions />
          </section>
        )}

        {/* Matières */}
        {subjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Mes matières</h2>
              <Link to="/add">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  stats={stats.subjectStats[subject.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Activité récente */}
        {subjects.length > 0 && (
          <section>
            <RecentActivity />
          </section>
        )}

        {/* Statistiques rapides */}
        {stats.sessionsCompleted > 0 && (
          <section className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.totalStudyTime}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Minutes étudiées</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{Math.round(stats.averageScore)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Score moyen</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{stats.sessionsCompleted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Index;
