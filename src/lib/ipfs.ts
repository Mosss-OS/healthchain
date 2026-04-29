export interface IPFSUploadResult {
  cid: string;
  url: string;
}

export async function encryptFile(file: File): Promise<{ encryptedBlob: Blob; key: string }> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyHex = Array.from(new Uint8Array(exportedKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const buffer = await file.arrayBuffer();
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    buffer
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return {
    encryptedBlob: new Blob([combined], { type: 'application/octet-stream' }),
    key: keyHex,
  };
}

export async function uploadToIPFS(blob: Blob, filename: string): Promise<IPFSUploadResult> {
  const jwt = import.meta.env.VITE_PINATA_JWT;
  const gateway = import.meta.env.VITE_PINATA_GATEWAY;

  if (!jwt) {
    console.warn('Pinata JWT not configured. Using mock IPFS upload.');
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockCid = `Qm${Array.from(crypto.getRandomValues(new Uint8Array(22)))
      .map(b => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[b % 58])
      .join('')}`;
    return {
      cid: mockCid,
      url: `https://${mockCid}.ipfs.w3s.link/${filename}`,
    };
  }

  const { PinataSDK } = await import('pinata');
  const pinata = new PinataSDK({ 
    pinataJwt: jwt,
    pinataGateway: gateway || undefined
  });

  const file = new File([blob], filename);
  const upload = await pinata.upload.public.file(file);

  let url: string;
  if (gateway) {
    url = `https://${gateway}/ipfs/${upload.cid}/${filename}`;
  } else {
    url = await pinata.gateways.public.convert(upload.cid);
  }

  return {
    cid: upload.cid,
    url,
  };
}

export async function uploadEncryptedFile(file: File): Promise<{
  cid: string;
  url: string;
  encryptedKey: string;
}> {
  const { encryptedBlob, key } = await encryptFile(file);
  const { cid, url } = await uploadToIPFS(encryptedBlob, file.name);

  return {
    cid,
    url,
    encryptedKey: key,
  };
}

export async function decryptFile(
  encryptedData: Uint8Array,
  keyHex: string
): Promise<Blob> {
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

  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new Blob([decrypted]);
}