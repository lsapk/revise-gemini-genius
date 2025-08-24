
import { Plus, Calendar, Brain, BarChart3, BookOpen, Zap } from 'lucide-react';
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
    title: 'Révision Express',
    description: 'Session de 10 min',
    icon: Zap,
    href: '/express-review',
    className: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50',
    iconClassName: 'text-orange-600'
  }
];

export function ModernQuickActions() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Actions rapides</h2>
        <p className="text-muted-foreground text-sm">
          Accédez rapidement à vos outils favoris
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.title}
            className={cn(
              "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2",
              action.className
            )}
          >
            <CardContent className="p-6">
              <Button 
                asChild 
                variant="ghost" 
                className="w-full h-auto p-0 hover:bg-transparent"
              >
                <Link to={action.href} className="block text-left">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      "bg-white dark:bg-gray-800/50 shadow-md"
                    )}>
                      <action.icon className={cn("w-6 h-6", action.iconClassName)} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
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
