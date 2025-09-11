import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items = [], className }: BreadcrumbNavProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs based on current route if items not provided
  const autoItems = React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', path: '/', icon: <Home className="w-4 h-4" /> }
    ];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = segment;
      
      // Customize labels for specific routes
      switch (segment) {
        case 'courses':
          label = 'Mes Cours';
          break;
        case 'subject':
          label = 'Matière';
          break;
        case 'lesson':
          label = 'Cours';
          break;
        case 'add':
          label = 'Ajouter';
          break;
        case 'stats':
          label = 'Statistiques';
          break;
        case 'settings':
          label = 'Paramètres';
          break;
        case 'planning':
          label = 'Planning';
          break;
        case 'assistant':
          label = 'Assistant';
          break;
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      
      breadcrumbs.push({ label, path });
    });
    
    return breadcrumbs;
  }, [location.pathname]);
  
  const finalItems = items.length > 0 ? items : autoItems;
  
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      {finalItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {item.path && index < finalItems.length - 1 ? (
            <Link
              to={item.path}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "flex items-center gap-1",
              index === finalItems.length - 1 && "text-foreground font-medium"
            )}>
              {item.icon}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}