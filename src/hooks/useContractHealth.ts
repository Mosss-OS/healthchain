import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { HEALTHCHAIN_CONTRACT } from '@/lib/contracts';

export function useContractHealth() {
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  
  // Simple contract check - try to read a record
  const { data, isError, error } = useReadContract({
    address: HEALTHCHAIN_CONTRACT.address,
    abi: HEALTHCHAIN_CONTRACT.abi,
    functionName: 'getPatientRecords',
    args: ['0x0000000000000000000000000000000000000000' as `0x${string}`],
    query: {
      retry: 1,
      retryDelay: 1000,
    },
  });

  if (isError) {
    console.error('Contract error:', error);
    setIsReachable(false);
  } else if (data !== undefined) {
    setIsReachable(true);
  }

  return {
    isReachable,
    recordCount: undefined, // Not available in current ABI
    isError,
    error,
  };
}