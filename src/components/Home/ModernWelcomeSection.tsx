
import { Sparkles, TrendingUp, BookOpen, Brain } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ProfessionalCard, ProfessionalCardContent } from '@/components/ui/professional-card';
import { Link } from 'react-router-dom';

interface WelcomeSectionProps {
  userName?: string;
}

export function ModernWelcomeSection({ userName = "Étudiant" }: WelcomeSectionProps) {
  return (
    <ProfessionalCard className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-30" />
      <ProfessionalCardContent className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Bonjour {userName} ! 👋
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Prêt à booster vos révisions avec l'intelligence artificielle ? 
                Découvrez une nouvelle façon d'apprendre, plus intelligente et plus efficace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ModernButton 
                asChild 
                variant="default" 
                size="lg"
                icon={<BookOpen />}
              >
                <Link to="/add">Ajouter un cours</Link>
              </ModernButton>
              
              <ModernButton 
                asChild 
                variant="outline" 
                size="lg"
                icon={<Brain />}
              >
                <Link to="/assistant">Assistant IA</Link>
              </ModernButton>
            </div>
          </div>

          <div className="lg:w-80">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-200/30 dark:border-blue-800/30">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">+87%</p>
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Performance</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-200/30 dark:border-green-800/30">
                <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">12k+</p>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">Étudiants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProfessionalCardContent>
    </ProfessionalCard>
  );
}
