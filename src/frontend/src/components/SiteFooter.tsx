import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'fs-enterprises');

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold">FS Enterprises</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for industrial hardware and power tools.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
                Catalog
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Contact</h3>
            <p className="text-sm text-muted-foreground">Best industrial supplies in PCMC</p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} FS Enterprises. Built with{' '}
            <Heart className="h-4 w-4 fill-amber-500 text-amber-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
