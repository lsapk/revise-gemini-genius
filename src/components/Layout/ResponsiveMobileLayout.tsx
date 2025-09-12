import { ReactNode } from 'react';
import { ModernBottomNavigation } from './ModernBottomNavigation';
import { ModernHeader } from './ModernHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveMobileLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function ResponsiveMobileLayout({ 
  children, 
  title,
  className 
}: ResponsiveMobileLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Header mobile */}
      {isMobile && <ModernHeader title={title} />}
      
      {/* Contenu principal */}
      <main className={cn(
        "flex-1",
        isMobile ? "pt-16 pb-20 mobile-safe" : "p-6",
        className
      )}>
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Navigation mobile */}
      {isMobile && <ModernBottomNavigation />}
    </div>
  );
}