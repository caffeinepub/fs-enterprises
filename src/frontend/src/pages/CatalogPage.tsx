import { useState } from 'react';
import { useGetAllProducts, getCategories } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import CategoryFilter from '../components/products/CategoryFilter';
import CategoryIconStrip from '../components/products/CategoryIconStrip';
import { Loader2 } from 'lucide-react';

export default function CatalogPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = getCategories(products);
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom">
        <h1 className="text-4xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Browse our complete selection of hardware and power tools
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom stagger-1">
        <CategoryIconStrip />
      </div>

      <div className="mb-8 animate-in fade-in slide-in-from-bottom stagger-2">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center animate-in fade-in">
          <p className="text-lg text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
