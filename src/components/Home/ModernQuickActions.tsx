
import { Plus, Calendar, Brain, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const quickActions = [
  {
    title: 'Nouveau cours',
    description: 'Ajoutez du contenu',
    icon: Plus,
    href: '/add',
    className: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50',
    iconClassName: 'text-blue-600'
  },
  {
    title: 'Planning',
    description: 'Organisez vos révisions',
    icon: Calendar,
    href: '/planning',
    className: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800 hover:shadow-green-200/50 dark:hover:shadow-green-900/50',
    iconClassName: 'text-green-600'
  },
  {
    title: 'Assistant IA',
    description: 'Posez vos questions',
    icon: Brain,
    href: '/assistant',
    className: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50',
    iconClassName: 'text-purple-600'
  },
  {
    title: 'Mes Statistiques',
    description: 'Suivez vos progrès',
    icon: BarChart3,
    href: '/stats',
    className: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50',
    iconClassName: 'text-orange-600'
  }
];

export function ModernQuickActions() {
  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-3">Actions rapides</h2>
        <p className="text-muted-foreground text-lg">
          Accédez rapidement à vos outils favoris
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card 
            key={action.title}
            className={cn(
              "group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border-2 overflow-hidden",
              action.className
            )}
          >
            <CardContent className="p-8">
              <Button 
                asChild 
                variant="ghost" 
                className="w-full h-auto p-0 hover:bg-transparent"
              >
                <Link to={action.href} className="block text-left">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
                      "bg-white dark:bg-gray-800/50 shadow-lg"
                    )}>
                      <action.icon className={cn("w-8 h-8", action.iconClassName)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
