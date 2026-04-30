import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { HEALTHCHAIN_CONTRACT } from '@/lib/contracts';

export function useContractHealth() {
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  
  // Simple check - just verify the contract exists
  const { isError, error } = useReadContract({
    address: HEALTHCHAIN_CONTRACT.address,
    abi: HEALTHCHAIN_CONTRACT.abi,
    functionName: 'getPatientRecords',
    args: ['0x0000000000000000000000000000000000000000' as `0x${string}`],
    query: {
      retry: 1,
      retryDelay: 1000,
      enabled: false, // Disable auto-fetch, just use for ABI validation
    },
  });

  // Contract is reachable if no parse error (wrong ABI)
  const isReachableNow = !isError || !error?.message?.includes('function not found');
  
  return {
    isReachable: isReachableNow,
    recordCount: undefined, // Not available in current ABI
    isError,
    error,
  };
}