
import { useEffect } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { ModernWelcomeSection } from '@/components/Home/ModernWelcomeSection';
import { ModernStatsGrid } from '@/components/Home/ModernStatsGrid';
import { ModernQuickActions } from '@/components/Home/ModernQuickActions';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { BookOpen, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { ModernSubjectCard } from '@/components/Home/ModernSubjectCard';
import { CreateSubjectModal } from '@/components/Subjects/CreateSubjectModal';

export default function Index() {
  const { subjects, stats, refreshSubjects } = useApp();

  useEffect(() => {
    refreshSubjects();
  }, [refreshSubjects]);

  // Provide default stats if undefined
  const safeStats = stats || {
    totalStudyTime: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    subjectStats: {}
  };

  return (
    <Layout title="Tableau de bord">
      <div className="space-y-8">
        {/* Section de bienvenue moderne */}
        <ModernWelcomeSection />

        {/* Statistiques modernes */}
        <ModernStatsGrid stats={safeStats} />

        {/* Actions rapides améliorées */}
        <ProfessionalCard>
          <ProfessionalCardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">Actions rapides</h2>
                <p className="text-muted-foreground">Créez et gérez votre contenu facilement</p>
              </div>
              <CreateSubjectModal />
            </div>
            <ModernQuickActions />
          </ProfessionalCardContent>
        </ProfessionalCard>

        {/* Mes matières */}
        <ProfessionalCard>
          <ProfessionalCardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">Mes matières</h2>
                <p className="text-muted-foreground">
                  {subjects.length === 0 
                    ? "Commencez par créer votre première matière" 
                    : `${subjects.length} matière${subjects.length > 1 ? 's' : ''} créée${subjects.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
              {subjects.length > 0 && (
                <CreateSubjectModal>
                  <ModernButton variant="outline" icon={<Plus />}>
                    Ajouter
                  </ModernButton>
                </CreateSubjectModal>
              )}
            </div>

            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Aucune matière créée</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Créez votre première matière pour commencer à organiser vos cours et révisions.
                </p>
                <CreateSubjectModal>
                  <ModernButton variant="gradient" size="lg" icon={<Plus />}>
                    Créer ma première matière
                  </ModernButton>
                </CreateSubjectModal>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <ModernSubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            )}
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>
    </Layout>
  );
}
