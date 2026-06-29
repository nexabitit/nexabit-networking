import { describe, expect, it } from 'vitest';
import { calculateCidr, validateIPv4, validateIPv6, calculateChmod } from './index';

describe('validateIPv4', () => {
  it('validates public IP', () => {
    const result = validateIPv4('8.8.8.8');
    expect(result.valid).toBe(true);
    expect(result.classification).toBe('Public');
  });

  it('detects private IP', () => {
    const result = validateIPv4('192.168.1.1');
    expect(result.valid).toBe(true);
    expect(result.isPrivate).toBe(true);
  });
});

describe('validateIPv6', () => {
  it('validates and expands IPv6', () => {
    const result = validateIPv6('::1');
    expect(result.valid).toBe(true);
    expect(result.isLoopback).toBe(true);
  });
});

describe('calculateCidr', () => {
  it('calculates /24 subnet', () => {
    const result = calculateCidr('192.168.1.0/24');
    expect(result.valid).toBe(true);
    expect(result.subnetMask).toBe('255.255.255.0');
    expect(result.usableHosts).toBe(254);
  });
});

describe('calculateChmod', () => {
  it('converts numeric to symbolic', () => {
    const result = calculateChmod('755');
    expect(result.valid).toBe(true);
    expect(result.symbolic).toBe('rwxr-xr-x');
  });
});
