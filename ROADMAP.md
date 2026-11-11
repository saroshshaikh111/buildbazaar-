# 🗺️ BuildBazaar: Product & Engineering Roadmap (2026–2027)

> **Status:** Post-v1.0.2 Mobile Update & Production Testing Cycle  
> **Target:** Scale BuildBazaar from pilot procurement to the premier B2B construction marketplace in Western India.

---

## 📍 Phase 1: Store Access & Security Hardening (Current Sprint)

- [x] Fix critical checkout validation holes (`quantity > 0` validation, `userId` spoofing prevention).
- [x] Add comprehensive Row Level Security (RLS) policies to `supabase_init.sql` for PII protection.
- [x] Submit Mobile App Version `1.0.2` (Build Code `3`) to Google Play Closed Testing track.
- [ ] Monitor Closed Testing: Ensure 4–5 core testers open app 2x/week and submit Play Store reviews.
- [ ] Submit Production Access questionnaire on Day 14 for public Google Play rollout.
- [ ] Audit Supabase free-tier connection limits and configure automatic daily database backups.

---

## 📦 Phase 2: B2B Order Lifecycle & Site Logistics (Weeks 2–4)

### 1. Delivery Verification & Escrow Release (Driver OTP)
* **Goal**: Solve site disputes on material arrival.
* **Mechanism**: When the delivery truck arrives, the site supervisor receives a 4-digit unloading OTP. They give this OTP to the driver only after inspecting bags/rebars.
* **Backend Trigger**: Entering OTP marks order `Delivered` and automatically triggers vendor escrow settlement.

### 2. WhatsApp Business Notifications
* **Goal**: Contractors operate 90% on WhatsApp, not email.
* **Implementation**: Connect Twilio or WhatsApp Cloud API to trigger automated WhatsApp messages:
  * Order confirmed with items summary & PDF quotation.
  * Truck dispatched with driver contact and live ETA.
  * Payment receipt and GST tax invoice.

### 3. Automated GST PDF Invoicing
* **Goal**: Builders need GST input tax credit for high-ticket procurement.
* **Implementation**: Integrate PDF generator (`@react-pdf/renderer` or serverless Puppeteer) generating compliant B2B tax invoices with HSN codes (Cement: `2523`, Steel: `7214`).

---

## 🏭 Phase 3: Hyperlocal Supplier Network & Pricing (Month 2)

### 1. Daily Depot Rate Management Portal
* **Goal**: Cement and steel prices fluctuate weekly.
* **Feature**: Build a fast, lightweight dealer interface (`/seller/rates`) allowing verified stockists in target pilot zones (e.g., Pune, Mumbai, Bangalore) to update daily per-bag and per-ton prices in 10 seconds.

### 2. Serviceable Pincode Geofencing
* **Goal**: Prevent contractors from placing orders in unserviceable locations.
* **Feature**: Enforce a strict pincode check at checkout based on supplier delivery radiuses (e.g., within 25km of depot).

### 3. Quality Certificates & MTC Reports
* **Goal**: Tier-1 builders require Mill Test Certificates (MTC) for structural compliance (IS 1786).
* **Feature**: Allow suppliers to attach PDF test certificates directly to batch dispatches.

---

## 📱 Phase 4: Mobile App Hardening & Engagement (Month 2–3)

- [ ] Integrate **Sentry** (`@sentry/react-native`) for real-time mobile crash tracking and telemetry.
- [ ] Configure **Expo EAS Update** (`expo-updates`) for instant Over-The-Air (OTA) bug fixes without waiting days for Google Play approval.
- [ ] Implement **Expo Push Notifications** for order status updates, delivery alerts, and daily morning rate broadcasts.
- [ ] Implement offline caching for the **Material Estimator** so site engineers can calculate quantities in basements with zero cellular connectivity.

---

## 💳 Phase 5: Contractor Credit & Scale (Month 4+)

- [ ] **B2B Payment Gateway**: Integrate Razorpay / Cashfree B2B payment rails alongside manual HSBC Escrow.
- [ ] **Credit Terms (15-Day BNPL)**: Partner with NBFCs/fintech lenders to provide 15–30 day credit lines for high-frequency civil contractors with verified GST returns.
- [ ] **Multi-Site Organization Accounts**: Allow construction firms to add site engineers under one master billing account with spend limits and approval workflows.
