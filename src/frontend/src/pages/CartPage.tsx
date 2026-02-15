import { useNavigate } from '@tanstack/react-router';
import { useGetCart, useCalculateCartTotal } from '../hooks/useCart';
import { useGetAllProducts } from '../hooks/useProducts';
import CartLineItem from '../components/cart/CartLineItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart = [], isLoading: cartLoading } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const { data: total = BigInt(0) } = useCalculateCartTotal();

  if (cartLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in zoom-in">
        <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Add some products to get started</p>
        <Button onClick={() => navigate({ to: '/catalog' })} className="smooth-transition hover-scale tap-scale">
          Browse Catalog
        </Button>
      </div>
    );
  }

  const cartWithProducts = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartWithProducts.map((item, index) => (
            <div key={item.productId} style={{ animationDelay: `${index * 0.1}s` }}>
              <CartLineItem item={item} />
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20 animate-in fade-in slide-in-from-right smooth-transition hover-lift">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-500">₹{Number(total).toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full smooth-transition hover-scale tap-scale hover-glow"
                size="lg"
                onClick={() => navigate({ to: '/checkout' })}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
