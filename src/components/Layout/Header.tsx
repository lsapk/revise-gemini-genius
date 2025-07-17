
import { ArrowLeft, Search, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, showBack = false, actions, className }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  return (
    <header className={cn(
      "sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div>
            {isHomePage ? (
              <div>
                <h1 className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
                  ReviseGenius
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Révision intelligente avec IA
                </p>
              </div>
            ) : (
              <h1 className="text-lg font-semibold">{title}</h1>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          {isHomePage && (
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
