import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAddToCart } from '../../hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Loader2 } from 'lucide-react';
import type { Product } from '../../backend';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const isAuthenticated = !!identity;
  const inStock = Number(product.quantity) > 0;
  const maxQuantity = Number(product.quantity);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    if (quantity < 1 || quantity > maxQuantity) {
      toast.error(`Please enter a quantity between 1 and ${maxQuantity}`);
      return;
    }

    await addToCart.mutateAsync({
      productId: product.id,
      quantity: BigInt(quantity),
    });
  };

  if (!isAuthenticated) {
    return (
      <Button disabled className="w-full" size="lg">
        Log in to Add to Cart
      </Button>
    );
  }

  if (!inStock) {
    return (
      <Button disabled className="w-full" size="lg">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
        />
      </div>
      <Button
        onClick={handleAddToCart}
        disabled={addToCart.isPending}
        className="w-full transition-all hover:scale-105"
        size="lg"
      >
        {addToCart.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
