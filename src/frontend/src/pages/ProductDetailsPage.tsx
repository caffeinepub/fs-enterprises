import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useProducts';
import ProductImage from '../components/products/ProductImage';
import AddToCartButton from '../components/cart/AddToCartButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Ruler, Info } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ProductDetailsPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(productId);

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
        <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
        <Button onClick={() => navigate({ to: '/catalog' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
      </div>
    );
  }

  const inStock = Number(product.quantity) > 0;

  return (
    <div className="container py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/catalog' })}
        className="mb-6 smooth-transition hover-scale tap-scale"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Catalog
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left overflow-hidden rounded-lg">
          <div className="smooth-transition hover:scale-105">
            <ProductImage image={product.image} alt={product.name} className="aspect-square" />
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-right">
          <div>
            <Badge variant="outline" className="mb-3 smooth-transition hover:bg-amber-500/10">
              {product.category}
            </Badge>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-amber-500">₹{Number(product.price).toLocaleString()}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3 smooth-transition hover:translate-x-1">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Size</p>
                <p className="text-lg">{product.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 smooth-transition hover:translate-x-1">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock</p>
                <p className="text-lg">
                  {inStock ? (
                    <span className="text-green-500">{Number(product.quantity)} available</span>
                  ) : (
                    <span className="text-destructive">Out of stock</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Product Information</h2>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
