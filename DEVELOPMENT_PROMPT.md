# HealthChain Development Prompt

## Project Overview
HealthChain is a decentralized health records management application built with:
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom glass-morphism design
- **Blockchain**: Base Sepolia (Ethereum L2) via wagmi + Privy embedded wallets
- **Storage**: Supabase (PostgreSQL) + IPFS (via Pinata) for medical records
- **Authentication**: Privy (email + wallet-based)

## Key Commands
- `npm run dev` - Start development server (runs on port 8080-8089)
- `npm run lint` - Run ESLint checks
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Architecture & Patterns

### Data Fetching
- **Supabase queries**: Use `@tanstack/react-query` via custom hooks in `src/hooks/`
- **Blockchain calls**: Use `wagmi` hooks in `src/hooks/useContract.ts`
- **IPFS uploads**: Use `src/hooks/useIPFS.ts` with Pinata

### Custom Hooks Structure
```typescript
// Example: src/hooks/useRecords.ts
export function useRecords() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || '';
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['records', walletAddress],
    queryFn: async () => {
      // Fetch from Supabase
    },
    enabled: !!walletAddress,
  });
  
  return { records: data, isLoading, error, refetch };
}
```

### Optimistic Updates Pattern
```typescript
const createRecord = async (record) => {
  // 1. Create optimistic record
  const optimisticRecord = { ...record, id: generateTempId() };
  
  // 2. Update cache optimistically  
  queryClient.setQueryData(['records', walletAddress], (old) => [...(old || []), optimisticRecord]);
  
  try {
    // 3. Make actual API call
    const { data, error } = await supabase.from('table').insert([record]).select().single();
    if (error) throw error;
    
    // 4. Update cache with real data
    queryClient.setQueryData(['records', walletAddress], (old) => 
      old?.map(item => item.id === optimisticRecord.id ? data : item) ?? []
    );
  } catch (err) {
    // 5. Rollback on error
    queryClient.setQueryData(['records', walletAddress], (old) => 
      old?.filter(item => item.id !== optimisticRecord.id) ?? []
    );
    throw err;
  }
};
```

## Database Schema

### Key Tables
1. **profiles** - User profiles linked to Privy
2. **medical_records** - Patient medical records with IPFS hashes
3. **access_permissions** - Record access grants between patients and providers
4. **appointments** - Scheduled appointments
5. **vitals** - Patient vital signs data
6. **notifications** - User notifications
7. **providers** - Verified healthcare providers

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data (patient_wallet = auth.uid())
- Providers can access records they have permission for

## Blockchain Integration

### Smart Contract
- **Contract**: `HEALTHCHAIN_CONTRACT` in `src/lib/contracts.ts`
- **Network**: Base Sepolia (chain ID: 84532)
- **Functions used**: `createRecord`, `grantAccess`, `revokeAccess`, `getRecord`, `getPatientRecords`

### Wagmi Hooks
```typescript
// Reading contract data
const { data, refetch } = useGetPatientRecords(walletAddress);

// Writing to contract  
const { writeContractAsync } = useWriteContract();
await writeContractAsync({ address, abi, functionName, args });
```

## IPFS Integration

### Pinata Setup
- Files uploaded to IPFS via Pinata API
- Encrypted before upload using Web Crypto API
- IPFS hash stored in `medical_records.ipfs_hash`
- Encrypted key stored in `medical_records.encrypted_key`

### File Upload Flow
1. User selects file → `FileUpload.tsx`
2. File encrypted in browser
3. Encrypted file uploaded to IPFS via Pinata
4. IPFS hash + encrypted key stored in Supabase
5. Record anchored on blockchain via smart contract

## Common Tasks

### Adding a New Page
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/AppLayout.tsx`
4. Create custom hook in `src/hooks/` if fetching data
5. Use real Supabase data (not mock data)

### Fixing Lint Errors
- **no-explicit-any**: Replace `any` with specific types
- **react-refresh/only-export-components**: Export components only, move constants to separate file
- **no-empty-object-type**: Use `type` instead of `interface` for empty objects

### Replacing Mock Data
1. Create custom hook in `src/hooks/` using `useQuery`
2. Update page to import and use the hook
3. Remove imports from `src/lib/mockData.ts`
4. Handle loading, error, and empty states
5. Test with real Supabase data

## Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PINATA_JWT=your_pinata_jwt
VITE_CONTRACT_ADDRESS=Base_Sepolia_contract_address
```

## Deployment
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set in Vercel dashboard

## Testing
- **Framework**: Vitest + React Testing Library
- **Run tests**: `npm run test`
- **Test files**: `src/test/*.test.ts`

## Important Notes
1. **Never commit `.env` files** - they're in `.gitignore`
2. **Always run lint** before committing: `npm run lint`
3. **Use TypeScript strict mode** - no `any` types
4. **Prefer real data** over mock data
5. **Test authentication flow** after making auth changes
6. **Check RLS policies** when adding new database queries
