
import { Plus, Brain, BarChart3, Calendar, FileText, Camera, Upload, Link as LinkIcon } from 'lucide-react';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader, ProfessionalCardTitle } from '@/components/ui/professional-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    icon: Plus,
    title: 'Nouveau cours',
    description: 'Ajouter du contenu à réviser',
    href: '/add',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
  },
  {
    icon: Brain,
    title: 'Assistant IA',
    description: 'Poser vos questions',
    href: '/assistant',
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20'
  },
  {
    icon: BarChart3,
    title: 'Statistiques',
    description: 'Voir vos progrès',
    href: '/stats',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'
  },
  {
    icon: Calendar,
    title: 'Planning',
    description: 'Organiser vos révisions',
    href: '/planning',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20'
  }
];

const addContentTypes = [
  {
    icon: FileText,
    title: 'Texte',
    description: 'Coller du texte directement',
    href: '/add?type=text',
    color: 'text-blue-600'
  },
  {
    icon: Upload,
    title: 'PDF',
    description: 'Importer un document',
    href: '/add?type=pdf',
    color: 'text-red-600'
  },
  {
    icon: Camera,
    title: 'Image',
    description: 'Scanner une photo',
    href: '/add?type=image',
    color: 'text-green-600'
  },
  {
    icon: LinkIcon,
    title: 'URL',
    description: 'Depuis un lien web',
    href: '/add?type=url',
    color: 'text-purple-600'
  }
];

export function ModernQuickActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Actions principales */}
      <ProfessionalCard>
        <ProfessionalCardHeader>
          <ProfessionalCardTitle>Actions rapides</ProfessionalCardTitle>
        </ProfessionalCardHeader>
        <ProfessionalCardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <ModernButton
                key={action.title}
                asChild
                variant="ghost"
                className={`h-auto p-6 bg-gradient-to-br ${action.bgGradient} hover:scale-105 border border-border/30 hover:border-primary/30`}
              >
                <Link to={action.href}>
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mx-auto shadow-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </ModernButton>
            ))}
          </div>
        </ProfessionalCardContent>
      </ProfessionalCard>

      {/* Ajouter du contenu */}
      <ProfessionalCard>
        <ProfessionalCardHeader>
          <ProfessionalCardTitle>Ajouter du contenu</ProfessionalCardTitle>
        </ProfessionalCardHeader>
        <ProfessionalCardContent>
          <div className="space-y-3">
            {addContentTypes.map((type) => (
              <ModernButton
                key={type.title}
                asChild
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-muted/50"
              >
                <Link to={type.href}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{type.title}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </Link>
              </ModernButton>
            ))}
          </div>
        </ProfessionalCardContent>
      </ProfessionalCard>
    </div>
  );
}
