export type AccountType =
  | 'bank'
  | 'cash'
  | 'stocks'
  | 'etf'
  | 'mutual_fund'
  | 'epf'
  | 'ppf'
  | 'nps'
  | 'fixed_deposit'
  | 'recurring_deposit'
  | 'gold'
  | 'real_estate'
  | 'bonds'
  | 'crypto'
  | 'other_asset'
  | 'loan'
  | 'credit_card'
  | 'liability';

export type AssetCategory = 'cash_bank' | 'equity' | 'debt_retirement' | 'precious_metals' | 'real_estate' | 'other' | 'liabilities';

export type TransactionType =
  | 'income'
  | 'expense'
  | 'investment_contribution'
  | 'investment_withdrawal'
  | 'transfer'
  | 'dividend'
  | 'interest';

export interface FinancialAccount {
  id: string;
  user_id: string;
  name: string;
  institution: string;
  account_type: AccountType;
  category: AssetCategory;
  currency: string;
  opening_date: string;
  initial_balance: number;
  current_balance: number;
  is_liability: boolean;
  interest_rate?: number;
  account_number_mask?: string;
  is_archived?: boolean;
  last_updated: string;
  notes?: string;
}

export interface BalanceSnapshot {
  id: string;
  account_id: string;
  user_id: string;
  recorded_date: string;
  balance: number;
  notes?: string;
  created_at: string;
}

export interface Holding {
  id: string;
  user_id: string;
  account_id: string;
  symbol: string;
  name: string;
  asset_type: 'stock' | 'etf' | 'mutual_fund' | 'gold_etf' | 'crypto' | 'bond';
  quantity: number;
  average_buy_price: number;
  current_market_price: number;
  cost_basis: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percentage: number;
  last_updated: string;
  currency: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id?: string; // for internal transfers
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
  tags?: string[];
  is_internal_transfer?: boolean;
}

export interface SalaryRecord {
  id: string;
  user_id: string;
  employer: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  annual_ctc: number;
  fixed_compensation: number;
  variable_compensation: number;
  monthly_gross: number;
  monthly_take_home: number;
  currency: string;
  created_at: string;
}

export interface SalaryHikePlan {
  id: string;
  user_id: string;
  employer_name: string;
  current_salary: number;
  expected_hike_percentage: number;
  projected_salary: number;
  effective_date: string;
  is_job_change: boolean;
  target_employer?: string;
  notes?: string;
  created_at: string;
}

export interface SavingsAssumptions {
  monthly_take_home: number;
  monthly_living_expenses: number;
  monthly_emis: number;
  monthly_discretionary: number;
  monthly_investments: number;
  expected_annual_bonus: number;
  expected_salary_growth_rate: number; // e.g. 10%
  expected_investment_return_rate: number; // e.g. 12%
  inflation_rate: number; // e.g. 6%
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: 'retirement' | 'home' | 'emergency_fund' | 'wealth_milestone' | 'vehicle' | 'education';
  created_at: string;
}

export interface NetWorthSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlySavings: number;
  monthlySavingsTarget: number;
  savingsRatePercentage: number;
  monthOverMonthChange: number;
  monthOverMonthPercentage: number;
  liquidCash: number;
  investedAssets: number;
  retirementAssets: number;
  lastUpdatedDate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  currency: string;
  theme: 'light' | 'dark';
  avatar_url?: string;
  created_at: string;
}
