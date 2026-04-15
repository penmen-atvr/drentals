# D'Rentals (HydCineRentals) 🎥

D'Rentals is a cross-platform, enterprise-grade Camera & Production equipment rental architecture native to Hyderabad. Designed with a cinematic dark-mode visual interface, it powers both a web-based e-commerce front and a seamless Android/iOS Companion application utilizing shared database clusters and state logic.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![React Native](https://img.shields.io/badge/Mobile-Expo_Go-black?style=for-the-badge&logo=react)](https://expo.dev/)
[![Database](https://img.shields.io/badge/Database-Neon_Serverless-black?style=for-the-badge&logo=postgresql)](https://neon.tech/)

## 🏗 System Architecture

The D'Rentals stack is split into two major components unified by a single Next.js database cluster & unified RESTful API standard:

1.  **D'Rentals Customer Facing Web Portal** (`/app`)
    *   **Framework**: Next.js 14+ (App Router).
    *   **Styling**: Vanilla CSS structure via standard Tailwind hooks. Hard-coded dark-mode styling utilizing glassmorphic layers (`backdrop-blur`).
    *   **Features**: Lightning fast Infinite Scrolling catalogs, Server-Side Pagination offset data loading, Cart/Checkout State Management.
2.  **D'Rentals Consumer Mobile Application** (`/mobile-app`)
    *   **Framework**: Expo & React Native.
    *   **Architecture**: High-performance Native SDK components decoupled from WebView limits.
    *   **State Management**: Transient client-side Zustand store tied into Next.js generic REST JSON interceptors (`/api/mobile/homepage`).
    *   **Navigation**: React Navigation (Bottom Tabs, Nested Stack Routing).

### ⚙️ The Database Layer

D'Rentals operates exclusively on **Neon Serverless PostgreSQL** driven by the **Drizzle ORM** instance mapped inside `/lib/db`. 

*   **Paginating Scale**: By querying identical datasets mapped via `OFFSET` & `LIMIT` across SQL layers, the platform natively prevents Out-of-Memory (OOM) bugs universally without limiting maximum vendor inventory size.
*   **Security Policies**: Full API endpoints utilizing strict JSON serialization. Hard fallback logic handles missing slugs dynamically routing by `ID`.

## 🚀 Getting Started

### Web Application (Next.js)

1. Ensure the `.env` configuration contains your active `DATABASE_URL` for Drizzle to hit Neon.
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Run the development portal:
   ```bash
   npm run dev
   ```

### Mobile Application (Expo / React Native)

1. Move directory state into the isolated package folder:
   ```bash
   cd mobile-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Spin up the Expo Go Metro Bundler:
   ```bash
   npx expo start
   ```

---

## 📱 Google Play Store Pre-Flight Guidelines

To guarantee the `mobile-app` module is securely approved under Google Play Protect Protocol guidelines during the upcoming deployment, this codebase explicitly adheres to the following conditions:

- **Permission Transparency:** Minimal permissions are requested. Currently, no risky broadcast receivers, background location sniffers, or unsolicited contact parsers run natively to break the Play Policy sandbox.
- **Image Protocol Safeties:** App imagery (CDNs) safely utilize optimized SSL hooks via `getOptimizedImage(url)`, bypassing potential unencrypted payload flag violations.
- **Deep Fallback Structures:** All HTTP fetches against external Next.js routes dynamically wrap inside `fetchWithTimeout` handlers. Timeouts inherently prevent Play Store review boots (Application Not Responding / ANR warnings) which trigger heavy penalty flags if an endpoint hangs up.
- **Appropriate Data Scoping:** All user and product analytics enforce generic payload stripping over REST API intercepts, ensuring user hardware isn't tracking restricted data metrics.

*Built under strict production guidelines for enterprise rental environments.*