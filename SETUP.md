# HealthChain Setup Guide

## Prerequisites
- Node.js v18+
- npm or Bun
- MetaMask wallet with Base Sepolia ETH
- Supabase account
- Privy account
- Web3.Storage account (optional - mock works)

## 1. Clone & Install
```bash
git clone https://github.com/Mosss-OS/healthchain.git
cd healthchain
npm install
```

## 2. Supabase Setup
1. Go to https://supabase.com → New Project
2. Wait for project to be ready
3. Go to SQL Editor → New Query
4. Copy contents of `supabase/migrations/00001_initial_schema.sql`
5. Run the SQL to create all tables
6. Go to Project Settings → API
7. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
8. Enable "RLS" on all tables (already in SQL)

## 3. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Deploy all functions
supabase functions deploy --project-ref <your-project-ref>
```

## 4. Privy Setup
1. Go to https://dashboard.privy.io
2. Create new app
3. Copy App ID → `VITE_PRIVY_APP_ID`
4. Copy App Secret → `VITE_PRIVY_APP_SECRET`
5. Add domains to "Allowed Callback URLs":
   - `https://healthchain-flax.vercel.app`
   - `http://localhost:8080`
6. Enable "Email" login method

## 5. Smart Contract Deployment

### Install Hardhat
```bash
npm install -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init  # Choose "Create an empty hardhat.config.js"
```

### Configure `hardhat.config.ts`
See `hardhat.config.ts` in project root.

### Deploy to Base Sepolia
```bash
# Set your private key (NEVER commit this!)
export PRIVATE_KEY=0xyour_private_key_without_0x

# Get Base Sepolia ETH from:
# https://bridge.base.org
# or https://sepoliafaucet.com

npx hardhat run scripts/deploy.ts --network base-sepolia
```

### Copy Contract Address
After deployment, copy the contract address → `VITE_CONTRACT_ADDRESS`

## 6. Web3.Storage (Optional)
1. Go to https://web3.storage
2. Create new token → `VITE_WEB3_STORAGE_TOKEN`

## 7. Update Vercel Environment Variables
```bash
vercel env add VITE_SUPABASE_URL production --force
vercel env add VITE_SUPABASE_ANON_KEY production --force
vercel env add VITE_PRIVY_APP_ID production --force
vercel env add VITE_PRIVY_APP_SECRET production --force
vercel env add VITE_CONTRACT_ADDRESS production --force
vercel env add VITE_WEB3_STORAGE_TOKEN production --force

# Redeploy
vercel deploy --prod --yes
```

## 8. Test Locally
```bash
# Create `.env` file
cat > .env << EOL
VITE_PRIVY_APP_ID=cmoikybyq00q60cjrs3ixa0bl
VITE_PRIVY_APP_SECRET=privy_app_secret_43oJ7vyFFwZbdJq4XWYMcbjuU2E2s74hub2QvLWPKBE8U51hApYpegdEbADAyApgnayWQCni5dhBK1ptoHtfY4SZ
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CONTRACT_ADDRESS=0x...
VITE_BASE_SEPOLIA_RPC=https://sepolia.base.org
EOL

npm run dev
```

## 9. Verify
- ✅ Go to https://healthchain-flax.vercel.app
- ✅ Click "Continue with email"
- ✅ Check Supabase dashboard for new user
- ✅ Test record creation
- ✅ Verify blockchain transaction

## Troubleshooting

### "Cannot initialize the Privy provider"
→ Whitelist `healthchain-flax.vercel.app` in Privy dashboard

### "Row Level Security policy"
→ Run in Supabase SQL: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`

### "Contract deployment failed"
→ Make sure you have Base Sepolia ETH (not mainnet!)

## Need Help?
- Open an issue: https://github.com/Mosss-OS/healthchain/issues
- Check setup progress: `SETUP.md`
