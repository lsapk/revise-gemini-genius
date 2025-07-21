
import { ReactNode } from 'react';
import { FuturisticLayout } from './FuturisticLayout';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export function Layout({ children, title, headerActions, className }: LayoutProps) {
  return (
    <FuturisticLayout 
      title={title}
      headerActions={headerActions}
      className={className}
    >
      {children}
    </FuturisticLayout>
  );
}
