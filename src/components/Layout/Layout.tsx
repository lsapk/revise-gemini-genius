
import { ModernHeader } from './ModernHeader';
import { ModernBottomNavigation } from './ModernBottomNavigation';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
}

export function Layout({ children, title, showBack, headerActions, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <ModernHeader 
        title={title}
        showBack={showBack}
        actions={headerActions}
      />
      
      <main className={cn("pb-24 md:pb-8", className)}>
        {children}
      </main>
      
      <ModernBottomNavigation />
    </div>
  );
}
