import { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 animate-in fade-in duration-300">{children}</main>
      <SiteFooter />
    </div>
  );
}
