/**
 * Validation utilities for authentication
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { valid: true };
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - at least 6 digits
  const phoneRegex = /^\+?[\d\s\-()]{6,}$/;
  return phoneRegex.test(phone);
};

export const validateDNI = (dni: string): boolean => {
  // Basic DNI validation - alphanumeric, 6-20 characters
  const dniRegex = /^[A-Za-z0-9]{6,20}$/;
  return dniRegex.test(dni);
};

export const validateRequired = (value: string, fieldName: string): { valid: boolean; message?: string } => {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
};
