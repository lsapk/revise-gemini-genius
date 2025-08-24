
import { Layout } from '@/components/Layout/Layout';
import { ModernWelcomeSection } from '@/components/Home/ModernWelcomeSection';
import { ModernStatsGrid } from '@/components/Home/ModernStatsGrid';
import { ModernQuickActions } from '@/components/Home/ModernQuickActions';
import { ModernSubjectCard } from '@/components/Home/ModernSubjectCard';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader, ProfessionalCardTitle } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { useApp } from '@/contexts/AppContext';
import { Plus, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { subjects, stats } = useApp();

  return (
    <Layout title="Tableau de bord" className="space-y-8">
      {/* Section d'accueil */}
      <ModernWelcomeSection />

      {/* Statistiques */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <GraduationCap className="w-7 h-7 text-primary" />
          Vos performances
        </h2>
        <ModernStatsGrid stats={stats} />
      </div>

      {/* Actions rapides */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Plus className="w-7 h-7 text-primary" />
          Actions rapides
        </h2>
        <ModernQuickActions />
      </div>

      {/* Matières */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Vos matières ({subjects.length})
          </h2>
          {subjects.length > 0 && (
            <ModernButton asChild variant="outline" size="sm">
              <Link to="/subjects">Voir toutes</Link>
            </ModernButton>
          )}
        </div>

        {subjects.length === 0 ? (
          <ProfessionalCard className="bg-gradient-to-br from-muted/30 to-muted/50">
            <ProfessionalCardHeader>
              <ProfessionalCardTitle className="text-center text-muted-foreground">
                Aucune matière pour le moment
              </ProfessionalCardTitle>
            </ProfessionalCardHeader>
            <ProfessionalCardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg">
                Commencez par ajouter votre premier cours pour débuter vos révisions
              </p>
              <ModernButton 
                asChild 
                variant="gradient" 
                size="lg"
                icon={<Plus />}
              >
                <Link to="/add">Ajouter mon premier cours</Link>
              </ModernButton>
            </ProfessionalCardContent>
          </ProfessionalCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subjects.slice(0, 6).map((subject) => (
              <ModernSubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
