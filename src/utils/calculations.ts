import { FinancialAccount, NetWorthSummary, SavingsAssumptions, Transaction } from '../types';

export function calculateNetWorthSummary(
  accounts: FinancialAccount[],
  _transactions: Transaction[] = [],
  assumptions?: SavingsAssumptions
): NetWorthSummary {
  let totalAssets = 0;
  let totalLiabilities = 0;
  let liquidCash = 0;
  let investedAssets = 0;
  let retirementAssets = 0;

  accounts.forEach((acc) => {
    if (acc.is_archived) return;

    if (acc.is_liability || acc.account_type === 'loan' || acc.account_type === 'credit_card' || acc.account_type === 'liability') {
      totalLiabilities += Math.abs(acc.current_balance);
    } else {
      totalAssets += acc.current_balance;

      if (acc.account_type === 'bank' || acc.account_type === 'cash') {
        liquidCash += acc.current_balance;
      } else if (acc.account_type === 'epf' || acc.account_type === 'ppf' || acc.account_type === 'nps') {
        retirementAssets += acc.current_balance;
      } else {
        investedAssets += acc.current_balance;
      }
    }
  });

  const netWorth = totalAssets - totalLiabilities;

  // If no accounts yet, fresh account has 0 savings/change
  const hasAccounts = accounts.length > 0;
  const monthlyTakeHome = hasAccounts ? (assumptions?.monthly_take_home || 115000) : 0;
  const monthlyExpenses = hasAccounts 
    ? ((assumptions?.monthly_living_expenses || 45000) + (assumptions?.monthly_emis || 20000) + (assumptions?.monthly_discretionary || 10000))
    : 0;
  const monthlySavings = Math.max(0, monthlyTakeHome - monthlyExpenses);
  const monthlySavingsTarget = hasAccounts ? 50000 : 0;
  const savingsRatePercentage = monthlyTakeHome > 0 ? (monthlySavings / monthlyTakeHome) * 100 : 0;

  // MoM change: 0 for fresh accounts, +8.4% demo baseline when accounts exist
  const monthOverMonthChange = hasAccounts ? 116000 : 0;
  const monthOverMonthPercentage = hasAccounts ? 8.4 : 0;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlySavings,
    monthlySavingsTarget,
    savingsRatePercentage,
    monthOverMonthChange,
    monthOverMonthPercentage,
    liquidCash,
    investedAssets,
    retirementAssets,
    lastUpdatedDate: new Date().toISOString(),
  };
}

export interface AllocationItem {
  name: string;
  category: string;
  value: number;
  percentage: number;
  color: string;
  badgeColor: string;
}

export function calculateAssetAllocation(accounts: FinancialAccount[]): AllocationItem[] {
  const activeAccounts = accounts.filter(a => !a.is_archived && !a.is_liability);
  const totalAssets = activeAccounts.reduce((sum, a) => sum + a.current_balance, 0);

  if (totalAssets === 0) {
    return [];
  }

  const grouped: Record<string, { name: string; value: number; color: string; badgeColor: string }> = {
    equity: { name: 'Stocks & ETFs', value: 0, color: '#3B82F6', badgeColor: 'bg-blue-500' },
    mutual_fund: { name: 'Mutual Funds', value: 0, color: '#F99D20', badgeColor: 'bg-amber-500' },
    cash_bank: { name: 'Bank Balances', value: 0, color: '#10B981', badgeColor: 'bg-emerald-500' },
    retirement: { name: 'EPF & PPF', value: 0, color: '#8B5CF6', badgeColor: 'bg-purple-500' },
    fixed_deposits: { name: 'Fixed Deposits', value: 0, color: '#06B6D4', badgeColor: 'bg-cyan-500' },
    gold_other: { name: 'Gold & Others', value: 0, color: '#F59E0B', badgeColor: 'bg-yellow-500' },
  };

  activeAccounts.forEach(acc => {
    if (acc.account_type === 'stocks' || acc.account_type === 'etf') {
      grouped.equity.value += acc.current_balance;
    } else if (acc.account_type === 'mutual_fund') {
      grouped.mutual_fund.value += acc.current_balance;
    } else if (acc.account_type === 'bank' || acc.account_type === 'cash') {
      grouped.cash_bank.value += acc.current_balance;
    } else if (acc.account_type === 'epf' || acc.account_type === 'ppf' || acc.account_type === 'nps') {
      grouped.retirement.value += acc.current_balance;
    } else if (acc.account_type === 'fixed_deposit' || acc.account_type === 'recurring_deposit') {
      grouped.fixed_deposits.value += acc.current_balance;
    } else {
      grouped.gold_other.value += acc.current_balance;
    }
  });

  return Object.entries(grouped)
    .filter(([_, data]) => data.value > 0)
    .map(([key, data]) => ({
      category: key,
      name: data.name,
      value: data.value,
      percentage: Number(((data.value / totalAssets) * 100).toFixed(1)),
      color: data.color,
      badgeColor: data.badgeColor,
    }))
    .sort((a, b) => b.value - a.value);
}

export type ForecastHorizon = '3M' | '6M' | '1Y' | '3Y' | '5Y';

export interface ForecastResult {
  horizonMonths: number;
  currentNetWorth: number;
  projectedNetWorth: number;
  financialGoal: number;
  completionPercentage: number;
  monthlySurplus: number;
  projectedGrowth: number;
  estimatedCompletionDate: string;
  monthlyData: { month: string; netWorth: number; savings: number; projected: boolean }[];
}

export function calculateForecast(
  currentNetWorth: number,
  assumptions: SavingsAssumptions,
  horizon: ForecastHorizon,
  goalAmount: number = 2500000
): ForecastResult {
  const monthsMap: Record<ForecastHorizon, number> = {
    '3M': 3,
    '6M': 6,
    '1Y': 12,
    '3Y': 36,
    '5Y': 60,
  };

  const months = monthsMap[horizon];
  const monthlyTakeHome = assumptions.monthly_take_home || 0;
  const monthlyExpenses = (assumptions.monthly_living_expenses || 0) + (assumptions.monthly_emis || 0) + (assumptions.monthly_discretionary || 0);
  const monthlySavings = Math.max(0, monthlyTakeHome - monthlyExpenses);

  // Expected annual returns on portfolio
  const monthlyReturnRate = Math.pow(1 + (assumptions.expected_investment_return_rate || 0) / 100, 1 / 12) - 1;

  let projectedValue = currentNetWorth;
  const monthlyData: { month: string; netWorth: number; savings: number; projected: boolean }[] = [];

  const now = new Date();

  // Past 3 months for context
  for (let i = 3; i >= 1; i--) {
    const pastDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const pastMonthName = pastDate.toLocaleString('default', { month: 'short' });
    monthlyData.push({
      month: pastMonthName,
      netWorth: Math.max(0, Math.round(currentNetWorth - (monthlySavings * i * 0.95))),
      savings: monthlySavings,
      projected: false,
    });
  }

  // Current
  monthlyData.push({
    month: 'Current',
    netWorth: Math.round(currentNetWorth),
    savings: monthlySavings,
    projected: false,
  });

  // Future progression
  for (let m = 1; m <= months; m++) {
    projectedValue = projectedValue * (1 + monthlyReturnRate) + monthlySavings;

    if (months <= 12 || m % 3 === 0 || m === months) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
      const mName = futureDate.toLocaleString('default', { month: 'short', year: months > 12 ? '2-digit' : undefined });
      monthlyData.push({
        month: mName,
        netWorth: Math.round(projectedValue),
        savings: monthlySavings * m,
        projected: true,
      });
    }
  }

  const completionPercentage = goalAmount > 0 ? Math.min(100, Math.round((projectedValue / goalAmount) * 100)) : 0;

  // Months to reach goal
  const shortfall = Math.max(0, goalAmount - currentNetWorth);
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(shortfall / (monthlySavings + (currentNetWorth * monthlyReturnRate))) : 60;
  const targetDateObj = new Date(now.getFullYear(), now.getMonth() + monthsToGoal, 1);
  const estimatedCompletionDate = targetDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
    horizonMonths: months,
    currentNetWorth,
    projectedNetWorth: Math.round(projectedValue),
    financialGoal: goalAmount,
    completionPercentage,
    monthlySurplus: monthlySavings,
    projectedGrowth: Math.round(projectedValue - currentNetWorth),
    estimatedCompletionDate,
    monthlyData,
  };
}
