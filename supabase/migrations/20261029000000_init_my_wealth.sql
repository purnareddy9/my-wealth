-- ==============================================================================
-- MY WEALTH — LIFETIME FINANCIAL TRACKER: POSTGRESQL + ROW-LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  currency TEXT DEFAULT 'INR',
  theme TEXT DEFAULT 'light',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Financial Accounts
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  account_type TEXT NOT NULL,
  category TEXT NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  opening_date DATE DEFAULT CURRENT_DATE NOT NULL,
  initial_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  current_balance NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  is_liability BOOLEAN DEFAULT FALSE NOT NULL,
  interest_rate NUMERIC(5, 2),
  account_number_mask TEXT,
  is_archived BOOLEAN DEFAULT FALSE NOT NULL,
  notes TEXT,
  last_updated TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Account Balance Snapshots (Immutable historical balance checkpoints)
CREATE TABLE IF NOT EXISTS public.balance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_date DATE DEFAULT CURRENT_DATE NOT NULL,
  balance NUMERIC(15, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Holdings (Stocks, ETFs, Mutual Funds, SGBs)
CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL,
  average_buy_price NUMERIC(15, 2) NOT NULL,
  cost_basis NUMERIC(15, 2) NOT NULL,
  current_market_price NUMERIC(15, 2) NOT NULL,
  current_value NUMERIC(15, 2) NOT NULL,
  unrealized_pnl NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  unrealized_pnl_percentage NUMERIC(8, 2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE CASCADE,
  to_account_id UUID REFERENCES public.financial_accounts(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'income', 'expense', 'investment_contribution', 'investment_withdrawal', 'transfer', 'dividend'
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_internal_transfer BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Salary History
CREATE TABLE IF NOT EXISTS public.salary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employer TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE NOT NULL,
  annual_ctc NUMERIC(15, 2) NOT NULL,
  fixed_compensation NUMERIC(15, 2) NOT NULL,
  variable_compensation NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  monthly_gross NUMERIC(15, 2) NOT NULL,
  monthly_take_home NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Salary Hike Plans
CREATE TABLE IF NOT EXISTS public.salary_hike_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employer_name TEXT NOT NULL,
  current_salary NUMERIC(15, 2) NOT NULL,
  expected_hike_percentage NUMERIC(5, 2) NOT NULL,
  projected_salary NUMERIC(15, 2) NOT NULL,
  effective_date DATE NOT NULL,
  is_job_change BOOLEAN DEFAULT FALSE NOT NULL,
  target_employer TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Financial Goals
CREATE TABLE IF NOT EXISTS public.financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL,
  current_amount NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,
  target_date DATE NOT NULL,
  category TEXT DEFAULT 'wealth_milestone' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR COMPLETE PRIVACY AND ISOLATION
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_hike_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Accounts
CREATE POLICY "Users can manage own accounts" ON public.financial_accounts
  FOR ALL USING (auth.uid() = user_id);

-- Balance Snapshots
CREATE POLICY "Users can manage own snapshots" ON public.balance_snapshots
  FOR ALL USING (auth.uid() = user_id);

-- Holdings
CREATE POLICY "Users can manage own holdings" ON public.holdings
  FOR ALL USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can manage own transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

-- Salary Records
CREATE POLICY "Users can manage own salary" ON public.salary_records
  FOR ALL USING (auth.uid() = user_id);

-- Salary Hike Plans
CREATE POLICY "Users can manage own hike plans" ON public.salary_hike_plans
  FOR ALL USING (auth.uid() = user_id);

-- Financial Goals
CREATE POLICY "Users can manage own goals" ON public.financial_goals
  FOR ALL USING (auth.uid() = user_id);

-- Trigger for automatically creating profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, first_name)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.financial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_account ON public.balance_snapshots(account_id);
CREATE INDEX IF NOT EXISTS idx_holdings_user ON public.holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_salary_user ON public.salary_records(user_id);
