import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={onSelectCategory}>
      <TabsList className="flex-wrap justify-start">
        <TabsTrigger value="all" className="transition-all hover:scale-105">
          All Products
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="transition-all hover:scale-105"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
