# Fix Google OAuth User ID Issue

## Problem
Google user IDs exceed JavaScript's MAX_SAFE_INTEGER, causing precision loss.

## Tasks
- [x] 1. Fix app/api/auth/google-callback/route.js - Use local DB user ID in JWT
- [x] 2. Fix app/api/commande/route.js - Handle integer user_id properly
- [x] 3. Verify app/page.js works with new JWT structure (already uses decoded.userId || decoded.id)
- [x] 4. Verify app/commande/page.js works (already uses decoded.userId || decoded.id)
- [x] 5. Verify app/commande/recapCommand/page.js works (already uses decoded.userId || decoded.id)

## Summary of Changes

### 1. app/api/auth/google-callback/route.js
- Find or create user in local database by email
- Use local database user ID (integer) in JWT instead of Google ID (BigInt string)
- This ensures user IDs are always valid integers

### 2. app/api/commande/route.js  
- Added validation for userId parsing
- Returns error for invalid userId values

## How it works now:
1. User logs in via Google OAuth
2. Google callback finds/creates user in local database by email
3. Local database ID (integer) is stored in JWT
4. All API calls use the local integer ID - no more precision issues!
