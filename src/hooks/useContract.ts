import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { HEALTHCHAIN_CONTRACT } from '@/lib/contracts';
import { getWalletClient } from '@/lib/wagmi';

export function useCreateRecord() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { data: txHash, isSuccess } = useWaitForTransactionReceipt();

  const createRecord = async (ipfsHash: string, recordType: string) => {
    try {
      const tx = await writeContractAsync({
        address: HEALTHCHAIN_CONTRACT.address,
        abi: HEALTHCHAIN_CONTRACT.abi,
        functionName: 'createRecord',
        args: [ipfsHash, recordType, BigInt(Date.now())],
      });
      return tx;
    } catch (err) {
      console.error('Create record failed:', err);
      throw err;
    }
  };

  return {
    createRecord,
    isPending,
    txHash,
    isSuccess,
    error,
  };
}

export function useGrantAccess() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { data: txHash, isSuccess } = useWaitForTransactionReceipt();

  const grantAccess = async (recordId: bigint, grantee: `0x${string}`, expiresAt: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: HEALTHCHAIN_CONTRACT.address,
        abi: HEALTHCHAIN_CONTRACT.abi,
        functionName: 'grantAccess',
        args: [recordId, grantee, expiresAt],
      });
      return tx;
    } catch (err) {
      console.error('Grant access failed:', err);
      throw err;
    }
  };

  return {
    grantAccess,
    isPending,
    txHash,
    isSuccess,
    error,
  };
}

export function useRevokeAccess() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const { data: txHash, isSuccess } = useWaitForTransactionReceipt();

  const revokeAccess = async (recordId: bigint, grantee: `0x${string}`) => {
    try {
      const tx = await writeContractAsync({
        address: HEALTHCHAIN_CONTRACT.address,
        abi: HEALTHCHAIN_CONTRACT.abi,
        functionName: 'revokeAccess',
        args: [recordId, grantee],
      });
      return tx;
    } catch (err) {
      console.error('Revoke access failed:', err);
      throw err;
    }
  };

  return {
    revokeAccess,
    isPending,
    txHash,
    isSuccess,
    error,
  };
}

export function useHasAccess() {
  const { data, isError, error, refetch } = useReadContract({
    address: HEALTHCHAIN_CONTRACT.address,
    abi: HEALTHCHAIN_CONTRACT.abi,
    functionName: 'hasAccess',
  });

  return {
    hasAccess: data as boolean | undefined,
    isError,
    error,
    refetch,
  };
}

export function useGetRecord() {
  const { data, isError, error, refetch } = useReadContract({
    address: HEALTHCHAIN_CONTRACT.address,
    abi: HEALTHCHAIN_CONTRACT.abi,
    functionName: 'getRecord',
  });

  return {
    record: data as [bigint, string, string, string, bigint, boolean] | undefined,
    isError,
    error,
    refetch,
  };
}
