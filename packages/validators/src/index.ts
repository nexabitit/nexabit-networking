const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

const PRIVATE_IPV4_RANGES = [
  { start: ipToNumber('10.0.0.0'), end: ipToNumber('10.255.255.255'), label: 'Private (Class A)' },
  {
    start: ipToNumber('172.16.0.0'),
    end: ipToNumber('172.31.255.255'),
    label: 'Private (Class B)',
  },
  {
    start: ipToNumber('192.168.0.0'),
    end: ipToNumber('192.168.255.255'),
    label: 'Private (Class C)',
  },
  { start: ipToNumber('127.0.0.0'), end: ipToNumber('127.255.255.255'), label: 'Loopback' },
  { start: ipToNumber('169.254.0.0'), end: ipToNumber('169.254.255.255'), label: 'Link-local' },
];

export function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function numberToIp(num: number): string {
  return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
}

export interface IPv4ValidationResult {
  valid: boolean;
  ip?: string;
  classification?: string;
  isPrivate?: boolean;
  isLoopback?: boolean;
  isLinkLocal?: boolean;
  error?: string;
}

export function validateIPv4(input: string): IPv4ValidationResult {
  const ip = input.trim();
  if (!IPV4_REGEX.test(ip)) {
    return { valid: false, error: 'Invalid IPv4 address format' };
  }

  const num = ipToNumber(ip);
  for (const range of PRIVATE_IPV4_RANGES) {
    if (num >= range.start && num <= range.end) {
      return {
        valid: true,
        ip,
        classification: range.label,
        isPrivate: range.label.includes('Private'),
        isLoopback: range.label === 'Loopback',
        isLinkLocal: range.label === 'Link-local',
      };
    }
  }

  return { valid: true, ip, classification: 'Public', isPrivate: false };
}

export interface IPv6ValidationResult {
  valid: boolean;
  ip?: string;
  expanded?: string;
  isLoopback?: boolean;
  isLinkLocal?: boolean;
  error?: string;
}

function expandIPv6(ip: string): string | null {
  try {
    const parts = ip.split('::');
    if (parts.length > 2) return null;

    const left = parts[0] ? parts[0].split(':').filter(Boolean) : [];
    const right = parts[1] ? parts[1].split(':').filter(Boolean) : [];
    const missing = 8 - left.length - right.length;
    if (missing < 0) return null;

    const full = [...left, ...Array(missing).fill('0'), ...right];
    if (full.length !== 8) return null;

    return full.map((g) => g.padStart(4, '0')).join(':');
  } catch {
    return null;
  }
}

export function validateIPv6(input: string): IPv6ValidationResult {
  const ip = input.trim();
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  if (!ipv6Regex.test(ip)) {
    return { valid: false, error: 'Invalid IPv6 address format' };
  }

  const expanded = expandIPv6(ip);
  if (!expanded) {
    return { valid: false, error: 'Could not expand IPv6 address' };
  }

  return {
    valid: true,
    ip,
    expanded,
    isLoopback: expanded === '0000:0000:0000:0000:0000:0000:0000:0001',
    isLinkLocal: expanded.toLowerCase().startsWith('fe80:'),
  };
}

export interface CidrResult {
  valid: boolean;
  network?: string;
  broadcast?: string;
  firstHost?: string;
  lastHost?: string;
  subnetMask?: string;
  wildcardMask?: string;
  totalHosts?: number;
  usableHosts?: number;
  cidr?: number;
  error?: string;
}

export function calculateCidr(input: string): CidrResult {
  const trimmed = input.trim();
  const match = trimmed.match(/^(.+)\/(\d+)$/);
  if (!match) {
    return { valid: false, error: 'Invalid CIDR format. Use e.g. 192.168.1.0/24' };
  }

  const [, ipStr, prefixStr] = match;
  const prefix = parseInt(prefixStr, 10);
  if (prefix < 0 || prefix > 32) {
    return { valid: false, error: 'Prefix must be between 0 and 32' };
  }

  const ipValidation = validateIPv4(ipStr);
  if (!ipValidation.valid) {
    return { valid: false, error: ipValidation.error };
  }

  const ipNum = ipToNumber(ipStr);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;

  const subnetMask = numberToIp(mask);
  const wildcardMask = numberToIp(wildcard);

  return {
    valid: true,
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    firstHost: prefix >= 31 ? numberToIp(network) : numberToIp(network + 1),
    lastHost: prefix >= 31 ? numberToIp(broadcast) : numberToIp(broadcast - 1),
    subnetMask,
    wildcardMask,
    totalHosts,
    usableHosts: Math.max(0, usableHosts),
    cidr: prefix,
  };
}

export interface ChmodResult {
  valid: boolean;
  symbolic?: string;
  numeric?: string;
  owner?: { read: boolean; write: boolean; execute: boolean };
  group?: { read: boolean; write: boolean; execute: boolean };
  others?: { read: boolean; write: boolean; execute: boolean };
  error?: string;
}

function parseSymbolicChmod(input: string): ChmodResult {
  const match = input.trim().match(/^([rwx-]{3})([rwx-]{3})([rwx-]{3})$/);
  if (!match) return { valid: false, error: 'Invalid symbolic format. Use e.g. rwxr-xr--' };

  const parseTriplet = (s: string) => ({
    read: s[0] === 'r',
    write: s[1] === 'w',
    execute: s[2] === 'x',
  });

  const owner = parseTriplet(match[1]);
  const group = parseTriplet(match[2]);
  const others = parseTriplet(match[3]);

  const toDigit = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);

  const numeric = `${toDigit(owner)}${toDigit(group)}${toDigit(others)}`;

  return { valid: true, symbolic: match[0], numeric, owner, group, others };
}

function parseNumericChmod(input: string): ChmodResult {
  const match = input.trim().match(/^([0-7])([0-7])([0-7])$/);
  if (!match) return { valid: false, error: 'Invalid numeric format. Use e.g. 755' };

  const digitToPerms = (d: number) => ({
    read: (d & 4) !== 0,
    write: (d & 2) !== 0,
    execute: (d & 1) !== 0,
  });

  const owner = digitToPerms(parseInt(match[1], 10));
  const group = digitToPerms(parseInt(match[2], 10));
  const others = digitToPerms(parseInt(match[3], 10));

  const toChar = (p: { read: boolean; write: boolean; execute: boolean }) =>
    `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;

  return {
    valid: true,
    symbolic: `${toChar(owner)}${toChar(group)}${toChar(others)}`,
    numeric: match[0],
    owner,
    group,
    others,
  };
}

export function calculateChmod(input: string): ChmodResult {
  const trimmed = input.trim();
  if (/^[rwx-]{9}$/.test(trimmed)) return parseSymbolicChmod(trimmed);
  if (/^[0-7]{3}$/.test(trimmed)) return parseNumericChmod(trimmed);
  return { valid: false, error: 'Enter symbolic (rwxr-xr--) or numeric (755) permissions' };
}

export interface PasswordStrengthResult {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
  entropy: number;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  const charset =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^a-zA-Z0-9]/.test(password) ? 32 : 0);

  const entropy = charset > 0 ? password.length * Math.log2(charset) : 0;

  const labels: PasswordStrengthResult['label'][] = [
    'Very Weak',
    'Weak',
    'Fair',
    'Strong',
    'Very Strong',
  ];
  const labelIndex = Math.min(Math.floor(score / 1.5), labels.length - 1);

  return { score, label: labels[labelIndex], feedback, entropy: Math.round(entropy) };
}

export function validateJson(input: string): { valid: boolean; formatted?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, formatted: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function validateCron(expression: string): {
  valid: boolean;
  description?: string;
  error?: string;
} {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return { valid: false, error: 'Cron expression must have 5 or 6 fields' };
  }

  const fieldNames =
    parts.length === 6
      ? ['second', 'minute', 'hour', 'day of month', 'month', 'day of week']
      : ['minute', 'hour', 'day of month', 'month', 'day of week'];

  const fieldPattern = /^(\*|[0-9,\-/]+)$/;
  for (let i = 0; i < parts.length; i++) {
    if (!fieldPattern.test(parts[i])) {
      return { valid: false, error: `Invalid ${fieldNames[i]} field: ${parts[i]}` };
    }
  }

  const description = parts
    .map((p, i) => `${fieldNames[i]}: ${p === '*' ? 'every' : p}`)
    .join(', ');

  return { valid: true, description };
}
