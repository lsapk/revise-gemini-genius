
import { ArrowLeft, Search, Bell, Sparkles } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthenticatedHeader } from './AuthenticatedHeader';
import { cn } from '@/lib/utils';

interface ModernHeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function ModernHeader({ title, showBack = false, actions, className }: ModernHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50",
      className
    )}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          {showBack && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1">
            {isHomePage ? (
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    ReviseGenius
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
                    Révision intelligente avec IA
                  </p>
                </div>
              </Link>
            ) : (
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate pr-4">
                {title}
              </h1>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {actions}
          
          {isHomePage && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></div>
              </Button>
            </>
          )}
          
          <AuthenticatedHeader />
        </div>
      </div>
    </header>
  );
}
