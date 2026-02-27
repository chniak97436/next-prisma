# Fix Plan: Module not found - Can't resolve 'child_process'

## Issue
nodemailer is being used in a client component, but it requires `child_process` which is a Node.js-only module not available in the browser.

## Solution
1. [x] Create API route `/api/send-payment-email/route.js` for server-side email sending
2. [x] Update `app/commande/recapCommand/page.js` to call the API route instead of directly importing sendEmail

## Files created/edited
- Created: `app/api/send-payment-email/route.js`
- Edited: `app/commande/recapCommand/page.js`

## Build Status
✅ Build completed successfully - No more "Module not found: Can't resolve 'child_process'" error
