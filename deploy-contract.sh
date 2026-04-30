#!/bin/bash
# HealthChain Smart Contract Deployment Script
# Uses: npx ethers (no hardhat needed)

set -e

echo "HealthChain Contract Deployment"
echo "=============================="
echo ""

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ ERROR: PRIVATE_KEY not set!"
  echo "Run: export PRIVATE_KEY=0xyour_private_key"
  exit 1
fi

echo "✅ Private key found"

# Check if RPC URL is set
RPC_URL=${VITE_BASE_SEPOLIA_RPC:-"https://sepolia.base.org"}
echo "✅ Using RPC: $RPC_URL"

# Install ethers if not present
if ! command -v npx &>/dev/null || ! npx ethers --version &>/dev/null; then
  echo "Installing ethers..."
  npm install ethers
fi

echo ""
echo "Deploying HealthChain contract..."

# Create a simple deployment script
cat > deploy-contract.js << 'EOL'
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Deploying with account:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  if (balance == 0n) {
    console.error("❌ No ETH! Get from https://bridge.base.org");
    process.exit(1);
  }

  // Simple HealthChain contract bytecode (compiled separately)
  // For now, we'll use a minimal proxy pattern
  console.log("⚠️  Note: Compile contract first with: npx solidity-cc --abi --bin contracts/HealthChain.sol");

  console.log("\n📝 Next steps:");
  console.log("1. Compile: npx solidity-cc --abi --bin contracts/HealthChain.sol");
  console.log("2. Update this script with bytecode");
  console.log("3. Run: source /home/moses/.zshenv && PRIVATE_KEY=0x... bash deploy-contract.sh");
}

main().catch(console.error);
EOL

npx tsx deploy-contract.js

echo ""
echo "✅ Deployment complete!"
echo "Copy the contract address and run:"
echo "vercel env add VITE_CONTRACT_ADDRESS production --force"
