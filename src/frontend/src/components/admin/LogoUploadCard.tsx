import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetLogo, useUpdateLogo } from '../../hooks/useLogo';
import { ExternalBlob } from '../../backend';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoUploadCard() {
  const { data: currentLogo } = useGetLogo();
  const updateLogo = useUpdateLogo();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await updateLogo.mutateAsync(blob);
      
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload logo');
    }
  };

  const currentLogoUrl = currentLogo?.getDirectURL();

  return (
    <Card className="smooth-transition hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-amber-500" />
          Site Logo
        </CardTitle>
        <CardDescription>
          Upload a logo to display in the header (Admin only - Niraj)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLogoUrl && !previewUrl && (
          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Current Logo:</p>
            <img
              src={currentLogoUrl}
              alt="Current site logo"
              className="h-20 w-20 object-contain rounded smooth-transition hover:scale-105"
            />
          </div>
        )}

        {previewUrl && (
          <div className="rounded-lg border border-border p-4 animate-in fade-in">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Preview:</p>
            <img
              src={previewUrl}
              alt="Logo preview"
              className="h-20 w-20 object-contain rounded smooth-transition hover:scale-105"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="logo-upload">Upload New Logo</Label>
          <Input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={updateLogo.isPending}
            className="smooth-transition"
          />
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || updateLogo.isPending}
          className="w-full smooth-transition hover-scale tap-scale"
        >
          {updateLogo.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
