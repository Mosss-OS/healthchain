import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(import.meta.env.VITE_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
  },
});