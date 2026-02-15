import { ImageOff } from 'lucide-react';
import type { ExternalBlob } from '../../backend';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  image?: ExternalBlob;
  alt: string;
  className?: string;
}

export default function ProductImage({ image, alt, className }: ProductImageProps) {
  if (!image) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          className
        )}
      >
        <ImageOff className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  const imageUrl = image.getDirectURL();

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}
