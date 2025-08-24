
import { 
  Home, 
  Plus, 
  BarChart3, 
  Settings, 
  Brain,
  BookOpen,
  Sparkles,
  Calendar
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

const mainItems = [
  { title: 'Accueil', url: '/', icon: Home },
  { title: 'Ajouter', url: '/add', icon: Plus },
  { title: 'Planning', url: '/planning', icon: Calendar },
  { title: 'Assistant IA', url: '/assistant', icon: Brain },
  { title: 'Statistiques', url: '/stats', icon: BarChart3 },
  { title: 'Paramètres', url: '/settings', icon: Settings },
];

export function MobileSidebar() {
  const { subjects } = useApp();

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-primary">
              ReviseGenius
            </h2>
            <p className="text-xs text-sidebar-foreground/60">IA Révision</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Navigation */}
        <div className="p-4">
          <div className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2">
            Navigation
          </div>
          <div className="space-y-1">
            {mainItems.map((item) => (
              <NavLink 
                key={item.title}
                to={item.url} 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Subjects */}
        {subjects.length > 0 && (
          <div className="p-4">
            <div className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2">
              Matières ({subjects.length})
            </div>
            <div className="space-y-1">
              {subjects.slice(0, 8).map((subject) => (
                <NavLink 
                  key={subject.id}
                  to={`/subject/${subject.id}`}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">{subject.name}</span>
                </NavLink>
              ))}
              {subjects.length > 8 && (
                <NavLink 
                  to="/subjects" 
                  className="text-sidebar-foreground/60 text-xs px-3 py-1 block"
                >
                  +{subjects.length - 8} autres matières
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          Version 2.1 • Interface améliorée
        </div>
      </div>
    </div>
  );
}
