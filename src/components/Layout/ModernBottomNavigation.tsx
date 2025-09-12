
import { Home, Plus, BarChart3, Settings, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function ModernBottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/add', icon: Plus, label: 'Ajouter', special: true },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
    { path: '/settings', icon: Settings, label: 'Réglages' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ path, icon: Icon, label, special }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 min-w-[64px] relative",
                special 
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110 -mt-2" 
                  : isActive 
                    ? "text-primary bg-primary/10 scale-105" 
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
              )}
            >
              {special && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
              )}
              <Icon className={cn(
                "w-5 h-5 mb-1",
                special ? "text-primary-foreground" : ""
              )} />
              <span className={cn(
                "text-xs font-medium",
                special ? "text-primary-foreground" : ""
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom"></div>
    </nav>
  );
}
