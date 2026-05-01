# Deploy HealthChain to Vercel

## Prerequisites
1. GitHub repository connected to Vercel
2. Supabase project set up with database schema (run `supabase/schema.sql`)
3. Privy app created with wallet integration
4. Smart contract deployed to Base Sepolia

## Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_PINATA_JWT=your-pinata-jwt-token
VITE_CONTRACT_ADDRESS=0x...
```

## Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Set Environment Variables
Add all variables from section above.

### 4. Deploy
Click "Deploy" - Vercel will build and deploy automatically.

## Smart Contract Deployment

### 1. Install dependencies
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### 2. Create Hardhat config
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### 3. Deploy script `scripts/deploy.js`
```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const HealthChain = await ethers.getContractFactory("HealthChain");
  const contract = await HealthChain.deploy();
  await contract.waitForDeployment();

  console.log("HealthChain deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 4. Deploy to Base Sepolia
```bash
npx hardhat run scripts/deploy.js --network base_sepolia
```

### 5. Update contract address
Copy the deployed contract address and update:
- `src/lib/contracts.ts` - update `HEALTHCHAIN_CONTRACT.address`
- Vercel env variable `VITE_CONTRACT_ADDRESS`

## Post-Deployment

### 1. Test the deployment
- Visit your Vercel URL
- Test login with Privy
- Create a test record
- Verify blockchain transaction

### 2. Set up custom domain (optional)
In Vercel Dashboard → Domains → Add Domain

### 3. Monitor
- Vercel Analytics for performance
- Supabase Dashboard for database
- Base Sepolia explorer for transactions

## CI/CD

Vercel auto-deploys on:
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments

## Rollback
If deployment fails:
1. Vercel Dashboard → Deployments
2. Click previous successful deployment
3. Click "Promote to Production"

## Resources
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)
- [Privy Docs](https://docs.privy.io)
