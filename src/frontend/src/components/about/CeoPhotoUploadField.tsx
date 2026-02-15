import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import { useUpdateCeoPhoto } from '../../hooks/useCeoPhoto';
import { toast } from 'sonner';

interface CeoPhotoUploadFieldProps {
  currentPhoto?: ExternalBlob | null;
}

export default function CeoPhotoUploadField({ currentPhoto }: CeoPhotoUploadFieldProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const updateCeoPhoto = useUpdateCeoPhoto();

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

      await updateCeoPhoto.mutateAsync(blob);
      toast.success('CEO photo updated successfully');
    } catch (error: any) {
      console.error('CEO photo upload error:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('admin')) {
        toast.error('Only Niraj (admin) can update the CEO photo.');
      } else {
        toast.error('Failed to update CEO photo. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-amber-500" />
        <Label className="text-sm font-semibold">Admin: Update CEO Photo</Label>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || updateCeoPhoto.isPending}
            className="flex-1"
          />
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {isUploading && (
          <div className="space-y-1">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground text-center">Uploading: {uploadProgress}%</p>
          </div>
        )}
        
        {updateCeoPhoto.isPending && !isUploading && (
          <p className="text-xs text-muted-foreground text-center">Saving to backend...</p>
        )}
      </div>
    </div>
  );
}
