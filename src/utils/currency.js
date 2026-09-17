/**
 * EduAcademy - Centralized Indian Rupee (INR) Currency Formatter
 * Formats all pricing and currency across the application in INR (₹).
 * Example:
 *   formatINR(1499) -> "₹1,499"
 *   formatINR(499)  -> "₹499"
 *   formatINR(2499) -> "₹2,499"
 */

export const formatINR = (amount, options = {}) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  const { showDecimals = false } = options;

  if (showDecimals && num % 1 !== 0) {
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

export const parseINR = (formattedStr) => {
  if (typeof formattedStr === 'number') return formattedStr;
  if (!formattedStr) return 0;
  const clean = String(formattedStr).replace(/[₹,\s]/g, '');
  return parseFloat(clean) || 0;
};
