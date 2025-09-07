
import { Home, Plus, BarChart3, Settings, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/courses', icon: BookOpen, label: 'Cours' },
    { path: '/add', icon: Plus, label: 'Ajouter' },
    { path: '/stats', icon: BarChart3, label: 'Stats' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/courses' && location.pathname.startsWith('/subject/')) ||
            (path === '/courses' && location.pathname.startsWith('/lesson/'));
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "text-primary bg-primary/10 scale-105" 
                  : "text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
