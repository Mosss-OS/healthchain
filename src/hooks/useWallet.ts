import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';

export function useWallet() {
  const { user, ready } = usePrivy();
  const { address, isConnected, isConnecting } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const walletAddress = address || user?.wallet?.address;
  const isReady = ready;
  const isWalletConnected = isConnected || !!user?.wallet;

  useEffect(() => {
    if (ready && user?.wallet?.address && !isConnected) {
      console.log('Wallet ready:', user.wallet.address);
    }
  }, [ready, user, isConnected]);

  return {
    address: walletAddress,
    isConnected: isWalletConnected,
    isConnecting: isConnecting && !user,
    isReady,
    connect: async () => {
      if (!ready) return;
    },
    disconnect: async () => {
      disconnect();
    },
  };
}