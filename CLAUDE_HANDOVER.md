# 🚀 BuildBazaar: Master Handover, Credentials & Run Guide
> **To Claude / Developer Taking Over:** This is the complete, single-source-of-truth handover for the **BuildBazaar** B2B construction materials platform. It contains all run commands, environment variables, API keys, dashboard accounts, and architectural context needed to take charge immediately on another computer.

---

## 🛠️ 1. How to Setup & Run the Project on a New Laptop

### Prerequisites:
* Install **Node.js LTS** (v20+ or v22+) from [nodejs.org](https://nodejs.org).
* Install **Git**.

### Repository:
```bash
git clone https://github.com/saroshshaikh111/buildbazaar-.git
cd buildbazaar-
```

### Running the Web Platform (Next.js):
```bash
# 1. Install root dependencies
npm install

# 2. Ensure .env.local exists in root (see Section 3 for keys)

# 3. Start local development server
npm run dev
# Live at: http://localhost:3000
```

### Running & Building the Mobile App (React Native / Expo):
```bash
cd mobile

# 1. Install mobile dependencies
npm install

# 2. Start local Metro bundler
npx expo start
# Press 'a' for Android emulator, 'w' for Web preview, or scan QR with Expo Go

# 3. Trigger Cloud Production AAB Build (for Google Play Store)
npx eas-cli build -p android --profile production

# 4. Trigger Direct Downloadable APK Build (for immediate testing on phone)
npx eas-cli build -p android --profile preview
```

---

## 🔑 2. Complete Credentials & Authentication Vault

| Service / Platform | Associated Email / Account | Dashboard / Access URL | Purpose & Keys |
|---|---|---|---|
| **GitHub** | `saroshshaikh111` | [github.com/saroshshaikh111/buildbazaar-](https://github.com/saroshshaikh111/buildbazaar-) | Primary source code repository |
| **Vercel** | Associated with `saroshshaikh111` | [vercel.com/dashboard](https://vercel.com/dashboard) | Production web hosting for `gobuildbazaar.com` |
| **Supabase** | `saroshaasim@gmail.com` | [supabase.com/dashboard](https://supabase.com/dashboard) | **Project ID:** `suqwlcobbirvsnbjjsxn`<br>**Database:** PostgreSQL + Auth + Storage |
| **Expo (EAS)** | `saroshshaikh111` (`saroshshaikh111@gmail.com`) | [expo.dev/accounts/saroshshaikh111](https://expo.dev/accounts/saroshshaikh111) | **Project ID:** `9cda576c-1462-441f-86a3-85c025f049a3`<br>EAS Android cloud builds & Keystores |
| **Google Play Console** | **CruxBox** Developer Account (Account Owner) | [play.google.com/console](https://play.google.com/console) | **App ID:** `com.gobuildbazaar.app`<br>Closed Testing track active |
| **Resend (Email)** | `saroshaasim@gmail.com` | [resend.com/dashboard](https://resend.com/dashboard) | Transactional emails from `orders@gobuildbazaar.com`<br>*(Key stored in `.env.local`: `re_CdH3o5SZ...`)* |
| **Google Cloud Console** | `saroshaasim@gmail.com` | [console.cloud.google.com](https://console.cloud.google.com) | Google OAuth 2.0 Client ID & Secret |
| **Twilio (SMS OTP)** | Managed via Supabase | Supabase → Auth → Providers → Phone | Powering Indian phone SMS OTP (`+91XXXXXXXXXX`) |
| **Domain Registrar** | BigRock | [bigrock.in](https://www.bigrock.in/) | Domain `gobuildbazaar.com` (DNS points to Vercel) |

---

## 📄 3. Complete `.env.local` File (Root Directory)

Save this exact content as `.env.local` in the project root:

```env
# Supabase Backend
NEXT_PUBLIC_SUPABASE_URL=https://suqwlcobbirvsnbjjsxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ehCJHB5z_LZUrPo4zozifw_-u3X7E6W

# Transactional Email (Resend)
RESEND_API_KEY=re_CdH3o5SZ_H9NntCFg8gVmzrPLv7t6dum2_PROTECTED_SEE_DASHBOARD
PLATFORM_EMAIL=orders@gobuildbazaar.com
NEXT_PUBLIC_ADMIN_EMAIL=saroshaasim@gmail.com

# 0% Fee Escrow Bank Transfer & UPI Details
ESCROW_UPI_ID=8867855362@ybl
ESCROW_ACCOUNT_NAME=Sarosh Aasim Shaikh
ESCROW_BANK_NAME=HSBC Bank
ESCROW_ACCOUNT_NUMBER=106246788006
ESCROW_IFSC_CODE=HSBC0411002
ESCROW_BRANCH_NAME=Main Branch
```

### Mobile Environment (`mobile/.env` & `mobile/eas.json`):
```env
EXPO_PUBLIC_SUPABASE_URL=https://suqwlcobbirvsnbjjsxn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ehCJHB5z_LZUrPo4zozifw_-u3X7E6W
```

---

## 📱 4. Google Play Store Live Status (Nov 11, 2026)

* **Current Track**: **Closed testing - Alpha**
* **Active Submission**: **Version `1.0.2` (Version Code `3`)**
* **Build File**: [Download v1.0.2 .aab](https://expo.dev/artifacts/eas/21AZAhhfkryFHdOJnX_hzQhtYEPCggwC4QIuDzkiuRM.aab)
* **Status in Console**: **"Changes in review"**
* **Tester Requirement**:
  * 12 testers are enrolled.
  * Google rejected the first application for low activity/feedback.
  * **Solution implemented**: We built an in-app **"Help Us Improve BuildBazaar"** card in the contractor console (`mobile/app/(tabs)/account.tsx`) with a 1-tap deep link to Google Play reviews.
  * **Next 14 Days**: Have 4–5 testers open the app 1–2 times a week and leave 1-line feedback in Google Play.

---

## 🛒 5. Key Business Logic & Code Locations

1. **Anti-Price Tampering**: `app/api/checkout/route.js` validates all prices directly against the Supabase `products` table before writing orders.
2. **Monetization Engine**: Automated 3% platform fee split calculated in `app/api/checkout/route.js` and `app/lib/paymentService.js`.
3. **Smart Material Calculator**: Logic located in `mobile/components/MaterialCalculator.js` and web `app/products/[id]/MaterialCalculator.js` (calculates cement bags, steel tons, brick counts from square footage).
4. **Phone OTP Auth**: Configured for Indian E.164 phone numbers (`+91XXXXXXXXXX`) with Supabase + Twilio in `mobile/app/auth.tsx`.
5. **Printable Site Quotation Flyer**: Located at `public/flyer.html` (`https://gobuildbazaar.com/flyer.html`) for generating A4 contractor sales brochures (`Ctrl + P`).
6. **30-Day Instagram Growth Calendar**: Located at `marketing/30_DAY_INSTAGRAM_CALENDAR.md` (13 Reels scripts, 8 Carousels, Stories, and hashtags).

---

## 🎯 6. Instructions for Claude on the New Laptop

When you open this project on the other computer with Claude:
1. Provide Claude with this `CLAUDE_HANDOVER.md` file.
2. Tell Claude: *"We are running BuildBazaar. Version 1.0.2 is in review on Google Play. Our immediate focus is executing the Instagram content calendar from `marketing/30_DAY_INSTAGRAM_CALENDAR.md` and setting up automated marketing while Google Play's 14-day clock runs."*
3. Claude will have 100% full context of every single file, key, and next step!
