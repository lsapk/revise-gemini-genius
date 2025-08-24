
import { ReactNode, useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Bell, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface ResponsiveLayoutProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
  className?: string;
}

export function ResponsiveLayout({ 
  children, 
  title, 
  headerActions,
  className 
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                  <AppSidebar />
                </SheetContent>
              </Sheet>
              
              {title && (
                <h1 className="text-lg font-semibold truncate">{title}</h1>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {headerActions}
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className={cn(
          "pb-20 min-h-[calc(100vh-64px)]",
          className
        )}>
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <SidebarInset className="flex-1">
            {/* Desktop Header */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  {title && (
                    <h1 className="text-xl font-semibold">
                      {title}
                    </h1>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {headerActions}
                  <Button variant="ghost" size="sm">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Desktop Content */}
            <main className={cn(
              "p-6 min-h-[calc(100vh-80px)]",
              className
            )}>
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
