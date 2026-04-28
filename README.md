# HealthChain
Decentralized, patient-owned medical records platform built on Base L2, with end-to-end encryption, IPFS storage, and blockchain-backed access control.

## Overview
HealthChain puts patients in full control of their medical data. Every record is encrypted locally, pinned to IPFS, and anchored on the Base Sepolia blockchain — accessible only with explicit patient consent. Designed with an Apple-inspired, mobile-first UI, it combines Web3 security with modern consumer app usability.

## Key Features
- **Patient-Owned Data**: Control who accesses your records, for how long, and whether a USDC fee is required
- **Blockchain Secured**: All access grants and record metadata anchored on Base L2 for tamper-proof audit trails
- **End-to-End Encrypted**: Files encrypted before IPFS upload — only you and authorized providers hold decryption keys
- **Instant Access Control**: Grant/revoke provider access in one tap with real-time on-chain updates
- **Live Health Insights**: Unified timeline of vitals, labs, and consultations with interactive Recharts visualizations
- **Privy Authentication**: Passwordless email login with embedded Base wallet provisioning

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + shadcn/ui + Framer Motion |
| Auth & Wallet | Privy (email-only login, embedded Base wallets) |
| Blockchain | Base Sepolia (L2 Ethereum), Solidity smart contracts |
| Storage | IPFS (via web3.storage/nft.storage) |
| Backend | Supabase (PostgreSQL + Deno Edge Functions) |
| Payments | USDC on Base Sepolia |
| State Management | Zustand + TanStack Query v5 |

## Getting Started
### Prerequisites
- Node.js v18+
- Privy App ID (for authentication)
- Supabase project (backend data storage)
- Base Sepolia testnet USDC (from [Circle Faucet](https://faucet.circle.com))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Mosss-OS/healthchain.git
   cd healthchain
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required variables:
   ```env
   VITE_PRIVY_APP_ID=your_privy_app_id
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address
   VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
   VITE_WEB3_STORAGE_TOKEN=your_web3storage_token
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
healthchain/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components (GlassCard, MetricCard, etc.)
│   ├── pages/       # Route-based page components (Dashboard, Records, Wallet)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities, mock data, Privy/config contracts
│   └── App.tsx      # Main app router
├── supabase/        # Supabase migrations and Edge Functions
└── package.json
```

## Smart Contracts
HealthChain's smart contract is deployed on Base Sepolia, supporting:
- Immutable medical record creation with IPFS hash linkage
- Granular access grant/revoke for providers
- On-chain access permission queries

Contract ABI and deployment details are in `src/lib/contracts.ts`.

## Current Status
This project is currently in active development using mock data. Full Supabase and smart contract integration is outlined in the [development prompt](./DEV_PROMPT_HealthChain.md.pdf).

## Links
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Privy Documentation](https://docs.privy.io)
- [Supabase Documentation](https://supabase.com/docs)
- [USDC Base Sepolia Contract](0x036CbD53842c5426634e7929541eC2318f3dCF7e)

## License
MIT
