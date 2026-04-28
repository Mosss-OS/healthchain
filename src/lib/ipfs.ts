import { from } from 'viem';
import { utils } from 'ethers';

// Mock IPFS upload - in real app, use web3.storage or nft.storage
// This is a placeholder that simulates IPFS upload

export interface IPFSUploadResult {
  cid: string;  // Content Identifier (IPFS hash)
  url: string;   // Gateway URL
}

/**
 * Encrypt file with AES-256-GCM
 * @param file - File to encrypt
 * @returns Encrypted blob and key
 */
export async function encryptFile(file: File): Promise<{ encryptedBlob: Blob; key: string }> {
  // Generate a random 256-bit key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Export the key for storage
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyHex = Array.from(new Uint8Array(exportedKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Read file as ArrayBuffer
  const buffer = await file.arrayBuffer();
  
  // Encrypt
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    buffer
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return {
    encryptedBlob: new Blob([combined], { type: 'application/octet-stream' }),
    key: keyHex,
  };
}

/**
 * Upload file to IPFS (mock implementation)
 * In production, use web3.storage or nft.storage client
 * @param blob - Blob to upload
 * @returns IPFS hash and gateway URL
 */
export async function uploadToIPFS(blob: Blob, filename: string): Promise<IPFSUploadResult> {
  // Mock implementation - simulates IPFS upload
  // In production, replace with:
  // const client = new Web3StorageClient({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
  // const cid = await client.put(blob, { name: filename });

  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock CID (in production, this comes from the IPFS client)
  const mockCid = `Qm${Array.from(crypto.getRandomValues(new Uint8Array(22)))
    .map(b => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[b % 58])
    .join('')}`;

  return {
    cid: mockCid,
    url: `https://${mockCid}.ipfs.w3s.link/${filename}`,
  };
}

/**
 * Upload and encrypt file
 * @param file - File to upload
 * @returns IPFS hash, URL, and encryption key
 */
export async function uploadEncryptedFile(file: File): Promise<{
  cid: string;
  url: string;
  encryptedKey: string;
}> {
  // Encrypt file
  const { encryptedBlob, key } = await encryptFile(file);

  // Upload to IPFS
  const { cid, url } = await uploadToIPFS(encryptedBlob, file.name);

  return {
    cid,
    url,
    encryptedKey: key,
  };
}

/**
 * Decrypt file (for download)
 * @param encryptedData - Encrypted data as Uint8Array (IV + encrypted)
 * @param keyHex - Hex-encoded AES key
 * @returns Decrypted Blob
 */
export async function decryptFile(
  encryptedData: Uint8Array,
  keyHex: string
): Promise<Blob> {
  // Import key
  const keyBuffer = new Uint8Array(
    keyHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // Extract IV and encrypted data
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new Blob([decrypted]);
}
