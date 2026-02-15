import { ReactNode } from 'react';
import { useGetCallerUserRole } from '../../hooks/useCurrentUserRole';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading } = useGetCallerUserRole();

  if (isInitializing || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  if (!isAuthenticated || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
