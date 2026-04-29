import { useReadContract } from 'wagmi';
import { HEALTHCHAIN_CONTRACT } from '@/lib/contracts';
import { useEffect, useState } from 'react';

export function useContractHealth() {
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  
  const { data, isError, error } = useReadContract({
    address: HEALTHCHAIN_CONTRACT.address,
    abi: HEALTHCHAIN_CONTRACT.abi,
    functionName: 'recordCount',
    query: {
      retry: 1,
      retryDelay: 1000,
    },
  });

  useEffect(() => {
    if (isError) {
      console.error('Contract error:', error);
      setIsReachable(false);
    } else if (data !== undefined) {
      setIsReachable(true);
    }
  }, [isError, error, data]);

  return {
    isReachable,
    recordCount: data as bigint | undefined,
    isError,
    error,
  };
}