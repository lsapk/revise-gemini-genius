
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Bell } from 'lucide-react';

interface FuturisticLayoutProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
  className?: string;
}

export function FuturisticLayout({ 
  children, 
  title, 
  headerActions,
  className 
}: FuturisticLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <SidebarInset className="flex-1">
            {/* Header futuriste */}
            <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="text-gray-400 hover:text-white transition-colors" />
                  {title && (
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {title}
                    </h1>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {headerActions}
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <Search className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 relative">
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                  </Button>
                </div>
              </div>
            </header>

            {/* Contenu principal */}
            <main className={cn(
              "p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-[calc(100vh-80px)]",
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
