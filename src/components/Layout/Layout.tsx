
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        title={title}
        showBack={showBack}
        actions={headerActions}
      />
      
      <main className={cn("mobile-safe", className)}>
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
