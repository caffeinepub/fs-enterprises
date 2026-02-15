import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductImage from './ProductImage';
import type { Product } from '../../backend';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = Number(product.quantity) > 0;

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="group h-full overflow-hidden border-border/50 smooth-transition hover-lift hover:border-amber-500/50 hover-glow">
        <div className="relative aspect-square overflow-hidden">
          <div className="smooth-transition group-hover:scale-110">
            <ProductImage image={product.image} alt={product.name} />
          </div>
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <Badge variant="outline" className="mb-2 smooth-transition group-hover:bg-amber-500/10">
            {product.category}
          </Badge>
          <h3 className="mb-1 line-clamp-2 font-semibold smooth-transition group-hover:text-amber-500">
            {product.name}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>Size: {product.size}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold text-amber-500">₹{Number(product.price).toLocaleString()}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
