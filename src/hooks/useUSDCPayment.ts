import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { USDC_CONTRACT } from '@/lib/contracts';
import { parseUnits } from 'viem';

export function useUSDCPayment() {
  const { writeContractAsync, isPending: isApprovePending, error: approveError } = useWriteContract();
  const { writeContractAsync: transfer, isPending: isTransferPending, error: transferError } = useWriteContract();
  const { data: txHash, isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt();
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDC_CONTRACT.address,
    abi: USDC_CONTRACT.abi,
    functionName: 'balanceOf',
    args: [], // Will be set when needed
  });

  const approveUSDC = async (spender: `0x${string}`, amount: string) => {
    try {
      const tx = await writeContractAsync({
        address: USDC_CONTRACT.address,
        abi: USDC_CONTRACT.abi,
        functionName: 'approve',
        args: [spender, parseUnits(amount, 6)],
      });
      return tx;
    } catch (err) {
      console.error('USDC approve failed:', err);
      throw err;
    }
  };

  const transferUSDC = async (to: `0x${string}`, amount: string) => {
    try {
      const tx = await transfer({
        address: USDC_CONTRACT.address,
        abi: USDC_CONTRACT.abi,
        functionName: 'transfer',
        args: [to, parseUnits(amount, 6)],
      });
      return tx;
    } catch (err) {
      console.error('USDC transfer failed:', err);
      throw err;
    }
  };

  const payWithUSDC = async (to: `0x${string}`, amount: string) => {
    try {
      // First approve
      await approveUSDC(to, amount);
      // Then transfer
      const tx = await transferUSDC(to, amount);
      return tx;
    } catch (err) {
      console.error('USDC payment failed:', err);
      throw err;
    }
  };

  return {
    approveUSDC,
    transferUSDC,
    payWithUSDC,
    balance: balance as bigint | undefined,
    isPending: isApprovePending || isTransferPending,
    isConfirming,
    isSuccess,
    txHash,
    error: approveError || transferError,
    refetchBalance,
  };
}

export function useUSDCBalance(address: `0x${string}`) {
  const { data, isError, error, refetch } = useReadContract({
    address: USDC_CONTRACT.address,
    abi: USDC_CONTRACT.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  return {
    balance: data as bigint | undefined,
    isError,
    error,
    refetch,
  };
}
