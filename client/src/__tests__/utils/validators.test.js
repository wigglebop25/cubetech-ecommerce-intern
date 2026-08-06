import { describe, it, expect } from 'vitest';
import { validateRequired, validateEmail, validatePhone, validatePositiveNumber } from '../../utils/validators';

describe('validateRequired', () => {
  it('returns null for valid input', () => {
    expect(validateRequired('hello', 'Name')).toBeNull();
  });

  it('returns error for empty string', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required');
  });

  it('returns error for whitespace only', () => {
    expect(validateRequired('   ', 'Name')).toBe('Name is required');
  });

  it('returns error for null', () => {
    expect(validateRequired(null, 'Name')).toBe('Name is required');
  });

  it('returns error for undefined', () => {
    expect(validateRequired(undefined, 'Name')).toBe('Name is required');
  });

  it('returns error for number zero (falsy)', () => {
    expect(validateRequired(0, 'Name')).toBe('Name is required');
  });
});

describe('validateEmail', () => {
  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
  });

  it('returns null for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeNull();
  });

  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for invalid format', () => {
    expect(validateEmail('invalid')).toBe('Invalid email format');
  });

  it('returns error for missing domain', () => {
    expect(validateEmail('test@')).toBe('Invalid email format');
  });

  it('returns error for missing @ symbol', () => {
    expect(validateEmail('test.com')).toBe('Invalid email format');
  });
});

describe('validatePhone', () => {
  it('returns null for valid 11-digit phone', () => {
    expect(validatePhone('09171234567')).toBeNull();
  });

  it('returns null for valid 10-digit phone', () => {
    expect(validatePhone('9171234567')).toBeNull();
  });

  it('returns error for empty phone', () => {
    expect(validatePhone('')).toBe('Phone number is required');
  });

  it('returns error for too short phone', () => {
    expect(validatePhone('123')).toBe('Invalid phone number');
  });

  it('returns error for non-numeric phone', () => {
    expect(validatePhone('abc1234567')).toBe('Invalid phone number');
  });
});

describe('validatePositiveNumber', () => {
  it('returns null for valid positive number', () => {
    expect(validatePositiveNumber(10, 'Price')).toBeNull();
  });

  it('returns null for decimal number', () => {
    expect(validatePositiveNumber(99.99, 'Price')).toBeNull();
  });

  it('returns error for zero', () => {
    expect(validatePositiveNumber(0, 'Price')).toBe('Price must be greater than 0');
  });

  it('returns error for negative number', () => {
    expect(validatePositiveNumber(-5, 'Price')).toBe('Price must be greater than 0');
  });

  it('returns error for empty string', () => {
    expect(validatePositiveNumber('', 'Price')).toBe('Price is required');
  });

  it('returns error for null', () => {
    expect(validatePositiveNumber(null, 'Price')).toBe('Price is required');
  });
});
