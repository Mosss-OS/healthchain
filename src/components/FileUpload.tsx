import { useState, useCallback } from 'react';
import { UploadCloud, X, FileText, Image } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';

interface FileUploadProps {
  onUploadComplete?: (result: { cid: string; url: string; key: string }) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export function FileUpload({ onUploadComplete, accept = "*", maxSize = 10 * 1024 * 1024 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFile = useCallback((f: File) => {
    if (f.size > maxSize) {
      setError(`File too large. Max size is ${maxSize / 1024 / 1024}MB`);
      return;
    }
    setFile(f);
    setError(null);
  }, [maxSize, setError, setFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files && files.length > 0) {
       handleFile(files[0]);
     }
   };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // In real app: encrypt and upload
      // const { cid, url, encryptedKey } = await uploadEncryptedFile(file);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const cid = `Qm${Array.from(crypto.getRandomValues(new Uint8Array(22)))
        .map(b => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[b % 58])
        .join('')}`;
      const url = `https://${cid}.ipfs.w3s.link/${file.name}`;
      const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      clearInterval(progressInterval);
      setProgress(100);

      onUploadComplete?.({ cid, url, key });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
  };

  return (
    <GlassCard className="p-4 md:p-6">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <UploadCloud className="h-8 w-8 md:h-10 md:w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm md:text-base font-medium">Drag & drop your file here</p>
          <p className="text-xs text-muted-foreground mt-1">or</p>
          <label className="inline-block mt-2 px-4 py-2 bg-foreground text-background rounded-full text-sm cursor-pointer hover:opacity-90 transition">
            Browse files
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Max file size: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-surface-muted/50 rounded-xl">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {file.type.startsWith('image/') ? (
                <Image className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {!uploading && (
              <button
                onClick={removeFile}
                className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="h-2 bg-surface-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Uploading... {progress}%
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          {!uploading && progress === 0 && (
            <button
              onClick={handleUpload}
              className="w-full py-2.5 md:py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-base min-h-[44px]"
            >
              Encrypt & Upload to IPFS
            </button>
          )}

          {progress === 100 && (
            <p className="text-sm text-success font-medium">✓ Upload complete!</p>
          )}
        </div>
      )}
    </GlassCard>
  );
}
