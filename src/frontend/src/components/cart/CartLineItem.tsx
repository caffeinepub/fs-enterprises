import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCartItem, useRemoveFromCart } from '../../hooks/useCart';
import ProductImage from '../products/ProductImage';
import { Trash2, Loader2 } from 'lucide-react';
import type { CartItem, Product } from '../../backend';
import { useState } from 'react';

interface CartLineItemProps {
  item: CartItem & { product?: Product };
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [quantity, setQuantity] = useState(Number(item.quantity));

  if (!item.product) return null;

  const product = item.product;

  const handleQuantityChange = async (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(Number(product.quantity), newQuantity));
    setQuantity(validQuantity);
    await updateCartItem.mutateAsync({
      productId: item.productId,
      quantity: BigInt(validQuantity),
    });
  };

  const handleRemove = async () => {
    await removeFromCart.mutateAsync(item.productId);
  };

  const itemTotal = Number(product.price) * quantity;

  return (
    <Card className="overflow-hidden border-border/50 animate-in fade-in slide-in-from-bottom smooth-transition hover-lift">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <ProductImage image={product.image} alt={product.name} />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <p className="text-sm font-medium text-amber-500">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={Number(product.quantity)}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 smooth-transition"
                  disabled={updateCartItem.isPending}
                />
                {updateCartItem.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={removeFromCart.isPending}
                className="text-destructive smooth-transition hover:bg-destructive/10 hover-scale tap-scale"
              >
                {removeFromCart.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <p className="text-lg font-bold">₹{itemTotal.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
