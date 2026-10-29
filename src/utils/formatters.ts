/**
 * Formats a number into Indian Rupee format (or specified currency)
 * e.g., 1500000 -> ₹15,00,000
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  compact: boolean = false
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === 'INR' ? '₹0' : '$0';
  }

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (currency === 'INR') {
      if (abs >= 10000000) {
        return `${sign}${symbol}${(abs / 10000000).toFixed(2)} Cr`;
      }
      if (abs >= 100000) {
        return `${sign}${symbol}${(abs / 100000).toFixed(2)} L`;
      }
      if (abs >= 1000) {
        return `${sign}${symbol}${(abs / 1000).toFixed(1)} k`;
      }
      return `${sign}${symbol}${abs.toLocaleString('en-IN')}`;
    } else {
      if (abs >= 1000000) {
        return `${sign}${symbol}${(abs / 1000000).toFixed(2)}M`;
      }
      if (abs >= 1000) {
        return `${sign}${symbol}${(abs / 1000).toFixed(1)}k`;
      }
      return `${sign}${symbol}${abs.toLocaleString()}`;
    }
  }

  if (currency === 'INR') {
    // Indian number format with comma grouping
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return `${symbol}${formatted}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(val: number, includeSign: boolean = true): string {
  if (isNaN(val) || val === null || val === undefined) return '0.0%';
  const sign = includeSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(1)}%`;
}

export function formatDate(dateStr: string, style: 'full' | 'short' | 'monthYear' = 'full'): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (style === 'monthYear') {
      return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }
    if (style === 'short') {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatCompactDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
