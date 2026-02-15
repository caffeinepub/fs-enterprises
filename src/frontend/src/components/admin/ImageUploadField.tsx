import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';

interface ImageUploadFieldProps {
  image?: ExternalBlob;
  onImageChange: (image: ExternalBlob | undefined) => void;
}

export default function ImageUploadField({ image, onImageChange }: ImageUploadFieldProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
      onImageChange(blob);
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    onImageChange(undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Product Image</Label>
      {image ? (
        <div className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
            <img
              src={image.getDirectURL()}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          </div>
          <Button type="button" variant="outline" onClick={handleRemove} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Remove Image
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="flex-1"
            />
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
