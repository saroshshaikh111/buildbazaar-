# 🌍 BuildBazaar: Project Resources & Control Center

This file contains all the essential links to manage and scale your platform. Keep these safe!

---

## 🚀 Live Environment
| Service | URL |
|---|---|
| **Live Website** | [https://gobuildbazaar.com](https://gobuildbazaar.com) |
| **Vercel Dashboard** | [https://vercel.com/dashboard](https://vercel.com/dashboard) |
| **Vercel Production Logs** | Vercel → Project → Deployments |
| **Vercel Env Variables** | Vercel → Project → Settings → Environment Variables |

---

## 🏗️ Core Infrastructure
| Service | URL | Notes |
|---|---|---|
| **GitHub Repository** | [https://github.com/saroshshaikh111/buildbazaar-](https://github.com/saroshshaikh111/buildbazaar-) | Main codebase |
| **Supabase Dashboard** | [https://supabase.com/dashboard](https://supabase.com/dashboard) | Project ID: `suqwlcobbirvsnbjjsxn` |
| **Supabase Auth Settings** | Supabase → Auth → Providers | Google OAuth configured here |
| **Supabase Storage** | Supabase → Storage → product-images | Seller product image uploads |
| **Supabase SQL Editor** | Supabase → SQL Editor | Run DB queries, use `supabase_init.sql` |

---

## 🔐 Authentication
| Service | URL | Notes |
|---|---|---|
| **Google Cloud Console** | [https://console.cloud.google.com/](https://console.cloud.google.com/) | OAuth 2.0 credentials live here |
| **Google OAuth Credentials** | GCC → APIs & Services → Credentials | Client ID & Secret configured |
| **Supabase Callback URL** | `https://suqwlcobbirvsnbjjsxn.supabase.co/auth/v1/callback` | Must be in Google's Authorized redirect URIs |

---

## 📧 Email & Notifications
| Service | URL | Notes |
|---|---|---|
| **Resend Dashboard** | [https://resend.com/dashboard](https://resend.com/dashboard) | Transactional emails |
| **Resend API Keys** | [https://resend.com/api-keys](https://resend.com/api-keys) | Used in `RESEND_API_KEY` env var |
| **Resend Domains** | [https://resend.com/domains](https://resend.com/domains) | `gobuildbazaar.com` domain verified here |

---

## 🌐 Domain Management
| Service | URL | Notes |
|---|---|---|
| **Domain Registrar (BigRock)** | [https://www.bigrock.in/](https://www.bigrock.in/) | `gobuildbazaar.com` registered here |
| **DNS Settings** | BigRock → Manage Orders → DNS → Manage | Point nameservers to Vercel |

---

## 🔑 Environment Variables (`.env.local`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `RESEND_API_KEY` | Resend email API key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin/owner email for seller access control |

---

## 📦 Key npm Packages
| Package | Purpose |
|---|---|
| `next` | React framework (App Router) |
| `@supabase/supabase-js` | Supabase database & auth client |
| `lucide-react` | Icon library |
| `resend` | Transactional email SDK |

---
*Last updated: V3.4 — Google OAuth + Full Responsive Mobile UI.*
