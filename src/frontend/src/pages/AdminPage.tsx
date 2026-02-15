import { useState } from 'react';
import { useGetAllProducts } from '../hooks/useProducts';
import AdminProductTable from '../components/admin/AdminProductTable';
import ProductForm from '../components/admin/ProductForm';
import LogoUploadCard from '../components/admin/LogoUploadCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { Product } from '../backend';

export default function AdminPage() {
  const { data: products = [] } = useGetAllProducts();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-bottom">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and site settings</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="smooth-transition hover-scale tap-scale">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 animate-in fade-in slide-in-from-bottom stagger-1">
        <LogoUploadCard />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom stagger-2">
        <AdminProductTable
          products={products}
          onEdit={(product) => setEditingProduct(product)}
        />
      </div>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
