
import { Plus, BookOpen, Brain, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    icon: Plus,
    label: 'Ajouter un cours',
    href: '/add',
    color: 'bg-blue-500',
    description: 'Importer du contenu'
  },
  {
    icon: Brain,
    label: 'Quiz rapide',
    href: '/quick-quiz',
    color: 'bg-purple-500',
    description: 'Révision express'
  },
  {
    icon: BookOpen,
    label: 'Flashcards',
    href: '/flashcards',
    color: 'bg-green-500',
    description: 'Mémorisation'
  },
  {
    icon: BarChart3,
    label: 'Statistiques',
    href: '/stats',
    color: 'bg-orange-500',
    description: 'Voir mes progrès'
  }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action) => (
        <Link key={action.href} to={action.href}>
          <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
            <CardContent className="p-4 text-center">
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
