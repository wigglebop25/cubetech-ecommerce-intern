import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

describe('formatCurrency', () => {
  it('formats a positive number with peso sign', () => {
    expect(formatCurrency(549)).toBe('₱549.00');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('₱0.00');
  });

  it('formats large numbers with commas', () => {
    expect(formatCurrency(10000)).toBe('₱10,000.00');
  });

  it('formats decimal numbers correctly', () => {
    expect(formatCurrency(99.5)).toBe('₱99.50');
  });

  it('handles string input', () => {
    expect(formatCurrency('549')).toBe('₱549.00');
  });
});

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    const result = formatDate('2025-01-15');
    expect(result).toContain('January');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('formats an ISO date string', () => {
    const result = formatDate('2025-06-20T10:30:00Z');
    expect(result).toContain('June');
    expect(result).toContain('20');
    expect(result).toContain('2025');
  });

  it('handles Date object input', () => {
    const result = formatDate(new Date('2025-03-10'));
    expect(result).toContain('March');
    expect(result).toContain('10');
    expect(result).toContain('2025');
  });
});

describe('formatDateTime', () => {
  it('formats a date with time', () => {
    const result = formatDateTime('2025-01-15T14:30:00');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });
});
