#!/bin/bash
echo "HealthChain Environment Verification"
echo "=================================="
echo ""

echo "Checking Vercel env vars..."
vercel env ls production 2>&1 | grep -E "(VITE_|SUPABASE_|PRIVY_)" || echo "No env vars found"

echo ""
echo "Checking local .env..."
if [ -f .env ]; then
  grep -E "VITE_|SUPABASE_|PRIVY_" .env || echo "No env vars in .env"
else
  echo ".env file not found"
fi

echo ""
echo "Checking Supabase connection..."
if [ -n "$VITE_SUPABASE_URL" ]; then
  curl -s "$VITE_SUPABASE_URL/rest/v1/" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" | grep -q "health" && echo "✅ Supabase connected" || echo "❌ Supabase connection failed"
else
  echo "❌ VITE_SUPABASE_URL not set"
fi

echo ""
echo "Checking Privy..."
if [ -n "$VITE_PRIVY_APP_ID" ]; then
  echo "✅ VITE_PRIVY_APP_ID is set"
else
  echo "❌ VITE_PRIVY_APP_ID not set"
fi

echo ""
echo "Checking Base Sepolia..."
if [ -n "$VITE_CONTRACT_ADDRESS" ] && [ "$VITE_CONTRACT_ADDRESS" != "0x0000000000000000000000000000000000000" ]; then
  echo "✅ VITE_CONTRACT_ADDRESS is set: $VITE_CONTRACT_ADDRESS"
else
  echo "❌ VITE_CONTRACT_ADDRESS not set or is placeholder"
fi

echo ""
echo "Next steps:"
echo "1. Create Supabase project: https://supabase.com"
echo "2. Run SQL: supabase/migrations/00001_initial_schema.sql"
echo "3. Deploy Edge Functions: supabase functions deploy"
echo "4. Deploy contract: npx hardhat run scripts/deploy.ts --network base-sepolia"
echo "5. Update Vercel env vars: vercel env add VITE_SUPABASE_URL production"
