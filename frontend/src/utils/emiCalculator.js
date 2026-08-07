/**
 * EMI Calculator — purely client-side arithmetic.
 * EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]
 *
 * @param {number} principal - Loan amount (₹)
 * @param {number} annualRate - Annual interest rate (e.g. 8.5 for 8.5%)
 * @param {number} tenureYears - Tenure in years
 * @returns {number} Monthly EMI in ₹
 */
export function calculateEMI(principal, annualRate = 8.5, tenureYears = 20) {
  if (!principal || principal <= 0) return 0;

  const r = annualRate / 12 / 100; // Monthly interest rate
  const n = tenureYears * 12; // Total months

  if (r === 0) return Math.round(principal / n);

  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}
