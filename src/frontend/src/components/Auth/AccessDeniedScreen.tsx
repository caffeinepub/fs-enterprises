import { Link } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AccessDeniedScreen() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          {isAuthenticated
            ? 'You do not have permission to access this page. Admin access is restricted to Niraj only.'
            : 'Please log in to access this page.'}
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/catalog">Browse Catalog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
