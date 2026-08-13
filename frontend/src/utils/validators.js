/**
 * Centralized Validation Utilities for Real Estate Application
 */

// Name: 2–50 chars, alphabetic characters + spaces only
export function validateName(name, label = 'Name') {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return `${label} is required`;
  }
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return `${label} must be between 2 and 50 characters`;
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return `${label} must contain only alphabetic characters and spaces`;
  }
  return null;
}

// Email: strict valid email format
export function validateEmail(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return 'Email address is required';
  }
  const trimmed = email.trim();
  if (trimmed.length > 100) {
    return 'Email address cannot exceed 100 characters';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return null;
}

// Mobile: exactly 10 digits, Indian format 6-9XXXXXXXXX
export function validatePhone(phone, required = true) {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return required ? 'Phone number is required' : null;
  }
  const trimmed = phone.trim();
  // Strip country code (+91 or 0) if user typed it
  const cleanPhone = trimmed.replace(/^(\+91|0)/, '').replace(/\s+/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return 'Phone number must be a valid 10-digit Indian mobile number (e.g. 9876543210)';
  }
  return null;
}

// Password: min 6, max 100 chars
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (password.length > 100) {
    return 'Password cannot exceed 100 characters';
  }
  return null;
}

// Message / Description: min & max length
export function validateText(text, label = 'Message', { min = 5, max = 2000, required = true } = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return required ? `${label} is required` : null;
  }
  const trimmed = text.trim();
  if (trimmed.length < min) {
    return `${label} must be at least ${min} characters long`;
  }
  if (trimmed.length > max) {
    return `${label} cannot exceed ${max} characters`;
  }
  return null;
}

// Numeric: type, range and integer checks
export function validateNumber(value, label = 'Value', { min = 0, max = Number.MAX_SAFE_INTEGER, integer = false, required = true } = {}) {
  if (value === undefined || value === null || value === '') {
    return required ? `${label} is required` : null;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${label} must be a valid number`;
  }
  if (integer && !Number.isInteger(num)) {
    return `${label} must be a whole number`;
  }
  if (num < min) {
    return `${label} must be at least ${min}`;
  }
  if (num > max) {
    return `${label} cannot exceed ${max}`;
  }
  return null;
}

// Select / Enum: allowed values
export function validateSelect(value, allowedValues, label = 'Selection') {
  if (!value || !allowedValues.includes(value)) {
    return `Please select a valid ${label.toLowerCase()}`;
  }
  return null;
}
