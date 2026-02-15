import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useCalculateCartTotal } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import { usePlaceOrder } from '../hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart = [] } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const { data: total = BigInt(0) } = useCalculateCartTotal();
  const placeOrder = usePlaceOrder();
  const [orderId, setOrderId] = useState<string | null>(null);

  const cartWithProducts = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const handlePlaceOrder = async () => {
    try {
      const id = await placeOrder.mutateAsync();
      setOrderId(id);
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  if (cart.length === 0 && !orderId) {
    navigate({ to: '/cart' });
    return null;
  }

  if (orderId) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="max-w-md animate-in fade-in zoom-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 animate-in zoom-in stagger-1">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">Your order has been confirmed.</p>
            <div className="rounded-lg bg-muted p-4 animate-in fade-in stagger-2">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-lg font-semibold">{orderId}</p>
            </div>
            <div className="flex flex-col gap-2 animate-in fade-in stagger-3">
              <Button onClick={() => navigate({ to: '/catalog' })} className="smooth-transition hover-scale tap-scale">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/' })} className="smooth-transition hover-scale tap-scale">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 animate-in fade-in slide-in-from-left">
          <Card className="smooth-transition hover-lift">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartWithProducts.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {Number(item.quantity)} × ₹{Number(item.product?.price).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(Number(item.quantity) * Number(item.product?.price)).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 animate-in fade-in slide-in-from-right smooth-transition hover-lift">
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-500">₹{Number(total).toLocaleString()}</span>
              </div>
              <Button
                className="w-full smooth-transition hover-scale tap-scale hover-glow"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
