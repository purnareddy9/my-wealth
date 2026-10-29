import { 
  FinancialAccount, 
  Holding, 
  Transaction, 
  SalaryRecord, 
  SalaryHikePlan, 
  SavingsAssumptions, 
  UserProfile 
} from '../types';
import { 
  DEMO_ACCOUNTS, 
  DEMO_HOLDINGS, 
  DEMO_TRANSACTIONS, 
  DEMO_SALARY_HISTORY, 
  DEMO_HIKE_PLANS, 
  DEMO_ASSUMPTIONS, 
  DEMO_USER 
} from './demoData';

const SESSION_KEY = 'my_wealth_session_user';
const IS_DEMO_KEY = 'my_wealth_is_demo';

export const storageService = {
  // Session
  getActiveUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading user session', e);
    }
    return null;
  },

  setActiveUser(user: UserProfile | null, isDemo: boolean = false) {
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        localStorage.setItem(IS_DEMO_KEY, isDemo ? 'true' : 'false');
      } else {
        localStorage.removeItem(SESSION_KEY);
        localStorage.setItem(IS_DEMO_KEY, 'true');
      }
    } catch (e) {
      console.error('Error saving user session', e);
    }
  },

  isDemoMode(): boolean {
    const val = localStorage.getItem(IS_DEMO_KEY);
    // If user has explicitly logged in, return false
    if (this.getActiveUser()) {
      return val === 'true';
    }
    return true; // Default to demo if not logged in
  },

  // User Accounts
  getAccounts(userId: string, isDemo: boolean): FinancialAccount[] {
    if (isDemo) return DEMO_ACCOUNTS;
    try {
      const saved = localStorage.getItem(`mw_accounts_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading accounts', e);
    }
    // New logged in user starts with clean empty state or personal account starter
    return [];
  },

  saveAccounts(userId: string, accounts: FinancialAccount[], isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_accounts_${userId}`, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts', e);
    }
  },

  // Holdings
  getHoldings(userId: string, isDemo: boolean): Holding[] {
    if (isDemo) return DEMO_HOLDINGS;
    try {
      const saved = localStorage.getItem(`mw_holdings_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading holdings', e);
    }
    return [];
  },

  saveHoldings(userId: string, holdings: Holding[], isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_holdings_${userId}`, JSON.stringify(holdings));
    } catch (e) {
      console.error('Error saving holdings', e);
    }
  },

  // Transactions
  getTransactions(userId: string, isDemo: boolean): Transaction[] {
    if (isDemo) return DEMO_TRANSACTIONS;
    try {
      const saved = localStorage.getItem(`mw_transactions_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading transactions', e);
    }
    return [];
  },

  saveTransactions(userId: string, transactions: Transaction[], isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_transactions_${userId}`, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions', e);
    }
  },

  // Salary
  getSalaryHistory(userId: string, isDemo: boolean): SalaryRecord[] {
    if (isDemo) return DEMO_SALARY_HISTORY;
    try {
      const saved = localStorage.getItem(`mw_salary_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading salary', e);
    }
    return [];
  },

  saveSalaryHistory(userId: string, history: SalaryRecord[], isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_salary_${userId}`, JSON.stringify(history));
    } catch (e) {
      console.error('Error saving salary', e);
    }
  },

  // Hike Plans
  getHikePlans(userId: string, isDemo: boolean): SalaryHikePlan[] {
    if (isDemo) return DEMO_HIKE_PLANS;
    try {
      const saved = localStorage.getItem(`mw_hikes_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading hikes', e);
    }
    return [];
  },

  saveHikePlans(userId: string, plans: SalaryHikePlan[], isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_hikes_${userId}`, JSON.stringify(plans));
    } catch (e) {
      console.error('Error saving hikes', e);
    }
  },

  // Assumptions
  getAssumptions(userId: string, isDemo: boolean): SavingsAssumptions {
    if (isDemo) return DEMO_ASSUMPTIONS;
    try {
      const saved = localStorage.getItem(`mw_assumptions_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading assumptions', e);
    }
    return DEMO_ASSUMPTIONS;
  },

  saveAssumptions(userId: string, assumptions: SavingsAssumptions, isDemo: boolean) {
    if (isDemo) return;
    try {
      localStorage.setItem(`mw_assumptions_${userId}`, JSON.stringify(assumptions));
    } catch (e) {
      console.error('Error saving assumptions', e);
    }
  },

  // Clear Session
  logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.setItem(IS_DEMO_KEY, 'true');
  }
};
