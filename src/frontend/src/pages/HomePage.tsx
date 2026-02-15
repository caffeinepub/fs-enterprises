import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wrench, Package, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container relative z-10 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-500">
                <Wrench className="h-4 w-4" />
                Industrial Hardware Specialists
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                FS Enterprises
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                Your trusted partner for premium hardware and power tools
              </p>
              <p className="text-lg text-muted-foreground">
                Discover our comprehensive catalog of industrial-grade equipment designed for professionals who demand excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="group transition-all hover:scale-105">
                  <Link to="/catalog">
                    Browse Catalog
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-all hover:scale-105">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted shadow-2xl">
                <img
                  src="/assets/generated/fs-enterprises-hero.dim_1600x600.png"
                  alt="Industrial hardware and power tools"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-muted/30 py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group flex flex-col items-center space-y-4 rounded-lg border border-border/50 bg-card p-8 text-center transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-lg">
              <div className="rounded-full bg-amber-500/10 p-4 transition-colors group-hover:bg-amber-500/20">
                <Package className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Wide Selection</h3>
              <p className="text-muted-foreground">
                Extensive catalog of hardware and power tools for every project
              </p>
            </div>

            <div className="group flex flex-col items-center space-y-4 rounded-lg border border-border/50 bg-card p-8 text-center transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-lg">
              <div className="rounded-full bg-amber-500/10 p-4 transition-colors group-hover:bg-amber-500/20">
                <ShieldCheck className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Quality Assured</h3>
              <p className="text-muted-foreground">
                Only the finest industrial-grade equipment from trusted brands
              </p>
            </div>

            <div className="group flex flex-col items-center space-y-4 rounded-lg border border-border/50 bg-card p-8 text-center transition-all hover:scale-105 hover:border-amber-500/50 hover:shadow-lg">
              <div className="rounded-full bg-amber-500/10 p-4 transition-colors group-hover:bg-amber-500/20">
                <Wrench className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Expert Support</h3>
              <p className="text-muted-foreground">
                Professional guidance to help you find the right tools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Explore our catalog and find the perfect tools for your next project
            </p>
            <Button asChild size="lg" className="transition-all hover:scale-105">
              <Link to="/catalog">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
