
import { Link } from 'react-router-dom';
import { Plus, Brain, Zap, BarChart3, MessageCircle, Sparkles } from 'lucide-react';
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';

export function ModernQuickActions() {
  const actions = [
    {
      title: 'Nouveau cours',
      description: 'Ajouter du contenu',
      icon: Plus,
      href: '/add',
      gradient: 'from-primary-500 to-primary-600',
      special: true
    },
    {
      title: 'Assistant IA',
      description: 'Chat intelligent',
      icon: MessageCircle,
      href: '/assistant',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Révision rapide',
      description: 'Flashcards',
      icon: Zap,
      href: '/review',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Mes stats',
      description: 'Progrès',
      icon: BarChart3,
      href: '/stats',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <ModernCard>
      <ModernCardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Actions rapides</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} to={action.href}>
                <Button
                  variant="ghost"
                  className={`w-full h-auto p-3 sm:p-4 flex flex-col gap-2 hover:scale-105 transition-all duration-300 ${
                    action.special 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                    action.special 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${action.gradient}`
                  }`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${action.special ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`font-medium text-xs sm:text-sm ${action.special ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {action.title}
                    </p>
                    <p className={`text-xs ${action.special ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </ModernCardContent>
    </ModernCard>
  );
}
