import { Building2, Award, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCeoPhoto } from '../hooks/useCeoPhoto';
import { useGetCallerUserRole } from '../hooks/useCurrentUserRole';
import { UserRole } from '../backend';
import CeoPhotoUploadField from '../components/about/CeoPhotoUploadField';

export default function AboutPage() {
  const { data: ceoPhoto, isLoading: ceoPhotoLoading } = useGetCeoPhoto();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAdmin = userRole === UserRole.admin;
  const ceoImageUrl = ceoPhoto?.getDirectURL() || '/assets/generated/ceo-chandrashekar-dhone.dim_800x800.png';

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About FS Enterprises</h1>
          <p className="text-xl text-muted-foreground">
            Best industrial supplies in PCMC
          </p>
        </div>

        {/* CEO Section */}
        <Card className="overflow-hidden border-border/50 animate-in fade-in slide-in-from-bottom stagger-1 smooth-transition hover-lift">
          <CardContent className="p-0">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden md:aspect-auto">
                {ceoPhotoLoading ? (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : (
                  <img
                    src={ceoImageUrl}
                    alt="Chandrashekar Dhone, CEO of FS Enterprises"
                    className="h-full w-full object-cover smooth-transition hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center space-y-4 p-8">
                <div>
                  <p className="text-sm font-medium text-amber-500">Chief Executive Officer</p>
                  <h2 className="text-3xl font-bold">Chandrashekar Dhone</h2>
                </div>
                <p className="text-muted-foreground">
                  Leading FS Enterprises with a vision to provide the finest industrial supplies and power tools to professionals across the region. With years of experience in the industry, our commitment to quality and customer satisfaction remains unwavering.
                </p>
                
                {/* Admin Upload Control */}
                {isAdmin && !roleLoading && (
                  <CeoPhotoUploadField currentPhoto={ceoPhoto} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Values */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/50 smooth-transition hover-lift hover:border-amber-500/50 animate-in fade-in slide-in-from-bottom stagger-2">
            <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
              <div className="rounded-full bg-amber-500/10 p-4 smooth-transition hover:scale-110">
                <Building2 className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Established Excellence</h3>
              <p className="text-sm text-muted-foreground">
                Years of trusted service in the industrial supplies sector
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 smooth-transition hover-lift hover:border-amber-500/50 animate-in fade-in slide-in-from-bottom stagger-3">
            <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
              <div className="rounded-full bg-amber-500/10 p-4 smooth-transition hover:scale-110">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Quality First</h3>
              <p className="text-sm text-muted-foreground">
                Only premium industrial-grade products from trusted manufacturers
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 smooth-transition hover-lift hover:border-amber-500/50 animate-in fade-in slide-in-from-bottom stagger-4">
            <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
              <div className="rounded-full bg-amber-500/10 p-4 smooth-transition hover:scale-110">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold">Customer Focus</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated support and personalized service for every client
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="border-border/50 animate-in fade-in slide-in-from-bottom stagger-4 smooth-transition hover-lift">
          <CardContent className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At FS Enterprises, we are committed to being the premier supplier of industrial hardware and power tools in the PCMC region. We strive to deliver exceptional quality products, competitive pricing, and unmatched customer service. Our goal is to empower businesses and professionals with the tools they need to succeed, backed by our expertise and dedication to excellence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
