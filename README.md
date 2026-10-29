# My Wealth — Lifetime Financial Tracker

**My Wealth** is a responsive personal finance and lifetime wealth tracking web application. It adapts a glassmorphism dashboard design into a financial control center.

---

## 🎨 Visual Design & UI Reproduction

The interface recreates the visual language of the reference glassmorphic dashboard:

1. **Pastel Abstract Background (`BackgroundPastel.tsx`)**:
   - Soft peach, beige, lavender, and powder-blue blurred organic shapes extending beyond the viewport.
   - Low-contrast, non-distracting ambient backdrop.

2. **Outer Glassmorphism Container**:
   - Translucent rounded panel (`rounded-[34px] sm:rounded-[42px]`) with `backdrop-filter: blur(32px)`.
   - Subtle semi-transparent border (`border border-white/65`), soft multi-layered shadows, and inner glow.

3. **Header (`Header.tsx`)**:
   - Left: Circular user avatar with initial/photo and **"Welcome, James!"** greeting.
   - Center: Wide pill-shaped search bar (`Search accounts, investments, transactions...`).
   - Right: Pill-style **Light / Dark** theme switcher with sun/moon icons, and notification bell button.

4. **Floating Vertical Sidebar (`Sidebar.tsx`)**:
   - Vertical frosted-glass pill dock on desktop with simple icons:
     - Overview (Home with active solid white circular badge)
     - Salary & Hike Forecast (Zap)
     - Accounts & Net Worth (Wallet)
     - Stock & MF Holdings (LineChart)
     - Transactions Ledger (ReceiptText)
     - Wealth Allocation & Analytics (PieChart)
     - Lifetime Wealth Reports (FileText)
     - Settings & Preferences (Settings)
   - Automatically adapts into a compact floating bottom dock on mobile devices.

5. **Inner Dashboard Layout (`Overview.tsx`)**:
   - **Card 1 — Total Net Worth**: Shows live net worth (e.g., **₹15,00,000**), current date, and positive/negative trend pill (**+8.4%**).
   - **Card 2 — Monthly Savings**: Shows current savings (**₹40,000 / ₹50,000 target**) with a circular SVG progress ring (**80%**).
   - **Card 3 — Total Assets & Liabilities**: Mini monthly vertical bar chart (Jan–Jun) with highlighted active period tag (**₹18L**) and liabilities (**₹3,00,000**).
   - **Middle Left (2x2 Grid)**: 4 compact cards for **Bank Accounts (₹2,00,000)**, **Stock Portfolio (₹4,50,000)**, **Mutual Funds (₹3,00,000)**, and **EPF / PF (₹2,50,000)** with interactive slider badges.
   - **Large Center Card — Wealth Allocation**: Interactive donut chart with category filters (**All Assets**, **Liquid**, **Equity**) and hover tooltips.
   - **Large Right Card — Financial Forecast**: Circular financial progress indicator inspired by the thermostat dial in the reference design. Includes **3M, 6M, 1Y, 3Y, 5Y** horizon toggles, target milestone estimates, and monthly surplus metrics.
   - **Bottom Category Selector (`BottomCategoryBar.tsx`)**: Horizontal pill bar (**Overview**, **Investments**, **Savings**, **Salary**, **Expenses**) with a circular **"+"** quick-action button.

---

## 🚀 Key Modules & Capabilities

### 1. Lifetime Wealth & Account Management
- Supports: Bank accounts, Cash, Stocks, ETFs, Mutual Funds, EPF/PF, PPF, NPS, Fixed Deposits, Recurring Deposits, Gold, Real Estate, and Loans/Liabilities.
- Net Worth calculation: $\text{Net Worth} = \text{Total Assets} - \text{Total Liabilities}$.
- Inline balance editing with instant recalculation.
- Historical balance snapshots preserving audit trail.

### 2. Salary & Savings Forecasting Engine
- **Employment History**: Records Employer, Role, Annual CTC, Fixed, Variable, and Net Monthly Take-Home.
- **Salary Hike Simulator**: Interactive slider for Expected Hike % (5%–60%), Job Switch toggle, and target employer simulation with dynamic income trajectory charts.
- **Multi-Horizon Savings Calculator**: Configurable monthly living expenses, EMIs, investments, and compounding returns ($3\text{M}, 6\text{M}, 12\text{M}, 3\text{Y}, 5\text{Y}$).

### 3. Investment Portfolio Tracker
- Tracks stocks and mutual funds with Symbol, Company Name, Quantity, Avg Buy Price, Market Price, Cost Basis, Current Value, and Unrealized P&L.
- Built-in CSV Statement Importer supporting broker formats (Zerodha Console, Groww).

### 4. Transactions Ledger & Double-Counting Prevention
- Records Inflows, Expenses, Investments (SIP), and Internal Transfers.
- **Double-Counting Prevention**: When moving funds between accounts owned by the same user, transactions are flagged as internal transfers, updating account balances without distorting total net worth.

### 5. Reports & Certified Statements
- Instant Wealth Statement generation.
- Full account data backup via **JSON** and **CSV** export.
- Print-ready format.
- Disclaimers and privacy notices.

---

## 🔒 Security & Database Architecture

- **PostgreSQL & Supabase Migration**: Located at `supabase/migrations/20261029000000_init_my_wealth.sql`.
- **Row-Level Security (RLS)**: Enforces database-level user isolation. Users can only query and mutate their own records.
- **Decimal Precision**: Financial fields stored as `NUMERIC(15, 2)` to eliminate floating-point rounding errors.
- **Zero Financial Secrets**: Broker passwords, PINs, and OTPs are never stored or requested.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row-Level Security (RLS).

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Production Build & Preview
```bash
npm run build
npm run preview -- --port 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Connect to Supabase
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
Execute the SQL migration located at `supabase/migrations/20261029000000_init_my_wealth.sql` in the Supabase SQL Editor.
