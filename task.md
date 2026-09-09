# Phase 5: Authentication & Session Tracking Tasks

## Core Architecture
- [x] Create `AuthContext.js` using Supabase's `onAuthStateChange` listener.
- [x] Inject `<AuthProvider>` directly into `app/layout.js`.

## The Authorization Wall
- [x] Build `/login` Next.js route with distinct Email/Password Forms.
- [x] Implement `signInWithPassword` and `signUp` trigger actions.
- [x] Intercept `/checkout` pipeline—redirecting unauthenticated users cleanly to the login screen.

## UI Integrity
- [x] Morph `app/page.js` navigation bar from a raw 'Sign In' to 'Hello! [Email]' when verified.
- [x] Wire 'Sign Out' functionality into the navigation structures.

## Phase 6: Production Deployment
- [x] Push current prototype state to GitHub repository (`saroshshaikh111/buildbazaar-`).
- [x] Connect GitHub repository to Vercel for automated CI/CD.
- [x] Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as production environment variables.
- [x] Verify public accessibility via `https://buildbazaar-two.vercel.app/` / `https://gobuildbazaar.com`.

## Phase 7: Product Detail Page (PDP) & Rich Content
- [x] Create dynamic route `app/products/[id]/page.js`.
- [x] Implement `ProductGallery.js` for high-resolution material inspection.
- [x] Build `MaterialCalculator.js` for quantity estimation (Cement/Bricks/Paint).
- [x] Expand SQL schema to support `product_specs`, `description`, and `images`.
- [x] Link `Add to Cart` functionality to the global `CartContext`.

## Phase 8: Mobile Application (Expo / React Native) E2E Verification
- [x] Configure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Install `react-dom` for static web router rendering (`expo-router` v6).
- [x] Compile production static export (`npx expo export --platform web`).
- [x] Verify mobile Authentication flow (`mobile/app/auth.tsx`).
- [x] Verify mobile Product Details & Material Estimator logic (`MaterialCalculator.js`).
- [x] Verify mobile Cart & Protected Checkout pipeline (`mobile/app/checkout.tsx`).
- [x] Verify mobile Seller Portal (`mobile/app/seller.tsx`).
