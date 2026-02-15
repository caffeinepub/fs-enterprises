import { useGetAllOrders } from '../hooks/useOrders';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Package, User } from 'lucide-react';
import type { Order } from '../backend';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12 animate-in fade-in zoom-in">
        <Package className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-bold">No Orders Yet</h1>
        <p className="text-muted-foreground">Orders will appear here once customers place them</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 animate-in fade-in slide-in-from-bottom">
        <h1 className="text-4xl font-bold tracking-tight">All Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <Card
            key={order.id}
            className="animate-in fade-in slide-in-from-bottom smooth-transition hover-lift"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-amber-500" />
                    Order #{order.id}
                  </CardTitle>
                  <OrderCustomerInfo order={order} />
                </div>
                <Badge variant="outline" className="text-lg font-bold text-amber-500">
                  ₹{Number(order.total).toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Order Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>Product ID: {item.productId}</span>
                    <span className="text-muted-foreground">Qty: {Number(item.quantity)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrderCustomerInfo({ order }: { order: Order }) {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  return (
    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
      <User className="h-4 w-4" />
      <span>
        {isLoading ? (
          'Loading...'
        ) : profile ? (
          <>
            {profile.name} ({order.user.toString().slice(0, 8)}...)
          </>
        ) : (
          order.user.toString().slice(0, 12) + '...'
        )}
      </span>
    </div>
  );
}
