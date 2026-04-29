import { useState } from 'react';
import { uploadEncryptedFile } from '@/lib/ipfs';

export function useUploadToIPFS() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    cid: string;
    url: string;
    key: string;
  } | null>(null);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const result = await uploadEncryptedFile(file);
      setUploadResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setUploadError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadError,
    uploadResult,
  };
}
