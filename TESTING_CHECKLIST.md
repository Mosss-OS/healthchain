# HealthChain End-to-End Test Checklist

## Pre-Deployment Checklist

### 1. Environment Setup ✅
- [x] Supabase project created
- [ ] Run database schema (`supabase/schema.sql`) in Supabase SQL Editor
- [ ] Set environment variables in Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_PRIVY_APP_ID`
  - `VITE_PINATA_JWT`
  - `VITE_CONTRACT_ADDRESS`

### 2. Smart Contract 📝
- [ ] Deploy `HealthChain.sol` to Base Sepolia
- [ ] Update `src/lib/contracts.ts` with deployed address
- [ ] Verify contract on Base Sepolia explorer

### 3. Authentication Testing 🔐
- [ ] Visit deployed URL
- [ ] Click "Get Started"
- [ ] Login with email (Privy)
- [ ] Verify wallet is created automatically
- [ ] Check user is redirected to Dashboard

### 4. Dashboard Testing 📊
- [ ] Dashboard loads with correct stats
- [ ] Total Records shows correct count
- [ ] Active Records shows correct count
- [ ] Blockchain status shows "Connected"
- [ ] Click "View All Records" → navigates to Records page

### 5. Records Testing 📄
- [ ] Records page loads with data from Supabase
- [ ] Search works (type in search box)
- [ ] Filter by type works (click filters)
- [ ] Click record → RecordDetail page loads
- [ ] RecordDetail shows correct data
- [ ] "Share access" button works
- [ ] "View file" button works (if IPFS hash exists)

### 6. Add Record Testing ➕
- [ ] Click "Add New Record"
- [ ] Select record type
- [ ] Fill in details
- [ ] Upload file (optional)
- [ ] Submit → should:
  - Upload to IPFS (if file)
  - Save to Supabase
  - Anchor on blockchain
  - Redirect to Records page
- [ ] Verify record appears in Records list

### 7. Vitals Testing 💓
- [ ] Vitals page loads with charts
- [ ] Summary cards show latest vitals
- [ ] Heart Rate chart displays
- [ ] Blood Pressure chart displays
- [ ] History list shows past vitals
- [ ] Click "Log Vitals"
- [ ] Fill in vitals form
- [ ] Submit → should save to Supabase
- [ ] Verify new vitals appear in list

### 8. Appointments Testing 📅
- [ ] Appointments page loads
- [ ] Filter by "Upcoming" / "Past" works
- [ ] Click "Book Appointment"
- [ ] Fill in appointment details
- [ ] Submit → should save to Supabase
- [ ] Verify appointment appears in list

### 9. Access Control Testing 🔒
- [ ] Access page loads
- [ ] Pending requests show (if any)
- [ ] Active grants show
- [ ] USDC balance displays (if wallet has USDC)
- [ ] Click "Revoke" on a grant → should revoke on-chain
- [ ] Verify grant disappears from list

### 10. Notifications Testing 🔔
- [ ] Notifications page loads
- [ ] Unread notifications show with blue dot
- [ ] Click notification → marks as read
- [ ] "Mark all read" button works
- [ ] Filter by "Unread" works

### 11. Providers Testing 👩⚕️
- [ ] Providers page loads
- [ ] Search by name/specialty works
- [ ] Verified providers show checkmark
- [ ] Click provider → should show details (if implemented)

### 12. Profile Testing 👤
- [ ] Profile page loads with user info
- [ ] Avatar shows initials
- [ ] Blood type displays (if set)
- [ ] "Verified" badge shows (if onboarded)
- [ ] Click "Personal info" → (if implemented)
- [ ] Click "Access control" → navigates to Access page
- [ ] Click "Notifications" → navigates to Notifications page
- [ ] Click "Sign out" → returns to Landing page

### 13. Responsive Testing 📱
- [ ] Test on mobile (Chrome DevTools)
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Verify 70% width on desktop
- [ ] Verify full width on mobile
- [ ] All buttons are touch-friendly (min 44px height)

### 14. Error Handling Testing ⚠️
- [ ] Disconnect internet → shows error boundary
- [ ] Click "Try again" → reloads
- [ ] Invalid route → shows 404 page
- [ ] API error → shows error message (not blank screen)

### 15. Performance Testing ⚡
- [ ] Run Lighthouse audit
- [ ] Check First Contentful Paint < 2s
- [ ] Check Time to Interactive < 3s
- [ ] Verify lazy loading works (React.lazy)

### 16. Security Testing 🔐
- [ ] Row Level Security works (users can't see others' data)
- [ ] Authentication required for all pages except Landing
- [ ] API keys not exposed in client-side code
- [ ] HTTPS enabled (Vercel provides automatically)

## Deployment Steps 🚀

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables (from section 1)
6. Click "Deploy"

### 3. Post-Deployment
- [ ] Visit deployed URL
- [ ] Run through checklist above
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics

## Quick Test Script 🏃

Run this to verify basic functionality:

```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, run lint
npm run lint

# 3. Run tests
npm run test

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## Common Issues & Fixes 🔧

### Issue: "Failed to fetch" in browser console
**Fix**: Check Supabase URL and anon key are correct

### Issue: "Wallet not connected"
**Fix**: Verify Privy app ID is correct and wallet creation is enabled

### Issue: "Transaction failed"
**Fix**: Ensure contract is deployed to Base Sepolia and address is correct

### Issue: "IPFS upload failed"
**Fix**: Check Pinata JWT token is valid and has remaining storage

### Issue: "Row Level Security violation"
**Fix**: Verify RLS policies are created in Supabase (run schema.sql)

## Support 💬
- GitHub Issues: [Create new issue](https://github.com/your-repo/healthchain/issues)
- Privy Discord: https://discord.gg/privy
- Supabase Discord: https://discord.gg/supabase
- Vercel Support: https://vercel.com/support

---
**Status**: ✅ Ready for deployment!
