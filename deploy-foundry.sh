#!/bin/bash
# HealthChain Smart Contract Deployment Script using Foundry
# Deploys to Base Sepolia with provided RPC URL and private key

set -e

echo "HealthChain Contract Deployment with Foundry"
echo "==========================================="
echo ""

# Check if private key is set (from user message)
if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ ERROR: PRIVATE_KEY not set!"
  echo "Using the private key provided in conversation:"
  echo "export PRIVATE_KEY=cb601f9647fa12dea8081b5bfed574f40f4f41996401ea5901bcb314392e90e9"
  echo "Then run: source deploy-foundry.sh"
  exit 1
fi

# Add 0x prefix if not present
if [[ $PRIVATE_KEY != 0x* ]]; then
  PRIVATE_KEY="0x$PRIVATE_KEY"
fi

echo "✅ Private key found"

# RPC URL from user message
RPC_URL=${VITE_BASE_SEPOLIA_RPC:-"https://base-sepolia.g.alchemy.com/v2/Ef456717OSoAY5b4ZMI10"}
echo "✅ Using RPC: $RPC_URL"

# Check if Etherscan API key is set for verification
if [ -z "$ETHERSCAN_API_KEY" ]; then
  echo "⚠️  WARNING: ETHERSCAN_API_KEY not set!"
  echo "Contract verification will be skipped."
  echo "Get one from: https://basescan.org/apis"
  echo "Then run: export ETHERSCAN_API_KEY=your_key_here"
else
  echo "✅ Etherscan API key found"
fi

# Derive address from private key
ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
echo "📬 Deploying from address: $ADDRESS"

# Check balance
BALANCE=$(cast balance $ADDRESS --rpc-url $RPC_URL)
BALANCE_ETH=$(cast from-wei $BALANCE)
echo "💰 Account balance: $BALANCE_ETH ETH"

if [ "$BALANCE" -eq 0 ]; then
  echo "❌ ERROR: Insufficient balance! Get test ETH from:"
  echo "   https://bridge.base.org (Base Sepolia faucet)"
  exit 1
fi

# Deploy contract using forge create
echo "🚀 Deploying HealthChain contract..."
# Deploy with --broadcast to actually send the transaction
DEPLOY_OUTPUT=$(forge create --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast HealthChain 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract contract address from output (look for "Deployed to:" line)
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Deployed to:" | awk '{print $3}')
if [ -z "$CONTRACT_ADDRESS" ]; then
  # Fallback: try to extract from the output
  CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -o '0x[a-fA-F0-9]\{40\}' | head -1)
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "❌ Failed to extract contract address from output."
  echo "Output:"
  echo "$DEPLOY_OUTPUT"
  exit 1
fi

echo "✅ Contract deployed to: $CONTRACT_ADDRESS"

# Save ABI for frontend
ABI=$(jq -r '.abi' out/HealthChain.sol/HealthChain.json)
echo "$ABI" > src/contracts/HealthChain.json
echo "✅ ABI saved to src/contracts/HealthChain.json"

# Verify contract on Basescan if API key is provided
if [ -n "$ETHERSCAN_API_KEY" ]; then
  echo "🔍 Verifying contract on Basescan..."
  # Verify using forge verify-contract
  # We need to verify the contract with the source code and constructor arguments (none)
  forge verify-contract --chain-id 84532 --num-of-optimizations 200 --watch $CONTRACT_ADDRESS HealthChain src/contracts/HealthChain.sol --etherscan-api-key $ETHERSCAN_API_KEY
else
  echo "⚠️  Skipping verification (no ETHERSCAN_API_KEY provided)"
fi

# Update Vercel environment variable
echo ""
echo "📝 Next steps:"
echo "1. Update Vercel environment variable:"
echo "   vercel env add VITE_CONTRACT_ADDRESS production"
echo "   Value: $CONTRACT_ADDRESS"
echo ""
echo "2. Update .env.local for development:"
echo "   VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
echo ""
echo "3. Contract details:"
echo "   Address: $CONTRACT_ADDRESS"
echo "   Explorer: https://basescan.org/address/$CONTRACT_ADDRESS"
echo "   Network: Base Sepolia"
echo ""
echo "✅ Deployment complete!"
