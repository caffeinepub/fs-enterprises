import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, ShoppingCart, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import LoginButton from './Auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../hooks/useCurrentUserRole';
import { useGetCart } from '../hooks/useCart';
import { useGetLogo } from '../hooks/useLogo';
import { useState } from 'react';

export default function SiteHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const { data: cart } = useGetCart();
  const { data: logo } = useGetLogo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';
  const cartItemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Catalog', path: '/catalog' },
    { label: 'About', path: '/about' },
  ];

  if (isAdmin) {
    navLinks.push({ label: 'Admin', path: '/admin' });
    navLinks.push({ label: 'Orders', path: '/admin/orders' });
  }

  const logoUrl = logo?.getDirectURL();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 smooth-transition hover-scale">
            {logoUrl ? (
              <img src={logoUrl} alt="FS Enterprises Logo" className="h-8 w-8 object-contain" />
            ) : (
              <Wrench className="h-6 w-6 text-amber-500" />
            )}
            <span className="text-xl font-bold tracking-tight">FS Enterprises</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground smooth-transition hover:text-foreground hover:scale-105"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative smooth-transition hover-scale"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs animate-in zoom-in"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          )}

          <div className="hidden md:block">
            <LoginButton />
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="smooth-transition hover-scale">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium text-muted-foreground smooth-transition hover:text-foreground"
                    activeProps={{ className: 'text-foreground' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4">
                  <LoginButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
