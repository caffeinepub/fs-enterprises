import { useState } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useAdminProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUploadField from './ImageUploadField';
import type { Product } from '../../backend';
import type { ExternalBlob } from '../../backend';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    category: product?.category || '',
    name: product?.name || '',
    size: product?.size || '',
    quantity: product ? Number(product.quantity) : 0,
    description: product?.description || '',
    price: product ? Number(product.price) : 0,
  });
  const [image, setImage] = useState<ExternalBlob | undefined>(product?.image);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      quantity: BigInt(formData.quantity),
      price: BigInt(formData.price),
      image,
    };

    try {
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          product: { ...productData, id: product.id } as Product,
        });
      } else {
        await createProduct.mutateAsync(productData as Omit<Product, 'id'>);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., Power Tools, Hardware"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Electric Drill"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="e.g., 13mm, Large"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          min={0}
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description..."
          rows={4}
          required
        />
      </div>

      <ImageUploadField image={image} onImageChange={setImage} />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : isEditing ? (
          'Update Product'
        ) : (
          'Create Product'
        )}
      </Button>
    </form>
  );
}
