
import { ReactNode } from 'react';
import { ResponsiveLayout } from './ResponsiveLayout';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export function Layout({ children, title, headerActions, className }: LayoutProps) {
  return (
    <ResponsiveLayout 
      title={title}
      headerActions={headerActions}
      className={className}
    >
      {children}
    </ResponsiveLayout>
  );
}
