/**
 * Formats a number as Indian currency (₹ Lakh/Crore).
 * Locale = India/INR as specified in prd.md.
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '—';

  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `₹ ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹ ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} L`;
  }

  return `₹ ${amount.toLocaleString('en-IN')}`;
}
