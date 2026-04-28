import { getDefaultConfig } from '@wagmi/core';
import { privy } from '@wagmi/connectors';
import { baseSepolia } from 'wagmi/chains';
import { http } from 'viem';
import { type PrivyUser } from '@privy-io/react-auth';

export const wagmiConfig = getDefaultConfig({
  connectors: [
    privy({
      privyId: import.meta.env.VITE_PRIVY_APP_ID || '',
    }),
  ],
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(import.meta.env.VITE_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
  },
});

// Helper to get wallet client from Privy user
export function getWalletClient(privyUser: PrivyUser) {
  const embeddedWallet = privyUser?.linkedAccounts?.find(
    (account) => account.type === 'wallet' && account.connectorType === 'embedded'
  );

  if (!embeddedWallet) throw new Error('No embedded wallet found');

  return privyUser.getEthereumProvider({
    address: embeddedWallet.address,
  });
}
