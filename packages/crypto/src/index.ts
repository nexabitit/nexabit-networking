export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

const ALGORITHM_MAP: Record<HashAlgorithm, string> = {
  MD5: 'MD5',
  'SHA-1': 'SHA-1',
  'SHA-256': 'SHA-256',
  'SHA-384': 'SHA-384',
  'SHA-512': 'SHA-512',
};

export async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(ALGORITHM_MAP[algorithm], data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generatePassword(options: {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  let charset = '';
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  return Array.from(array, (n) => charset[n % charset.length]).join('');
}

export function generateUuid(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function base64Encode(text: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(text)));
  }
  return Buffer.from(text, 'utf-8').toString('base64');
}

export function base64Decode(encoded: string): { success: boolean; text?: string; error?: string } {
  try {
    if (typeof atob !== 'undefined') {
      return { success: true, text: decodeURIComponent(escape(atob(encoded))) };
    }
    return { success: true, text: Buffer.from(encoded, 'base64').toString('utf-8') };
  } catch {
    return { success: false, error: 'Invalid Base64 input' };
  }
}

export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
  error?: string;
}

export function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: '',
      valid: false,
      error: 'JWT must have three parts separated by dots',
    };
  }

  try {
    const decodePart = (part: string) => {
      const padded = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = base64Decode(padded);
      if (!json.success || !json.text) throw new Error('Invalid base64');
      return JSON.parse(json.text);
    };

    return {
      header: decodePart(parts[0]),
      payload: decodePart(parts[1]),
      signature: parts[2],
      valid: true,
    };
  } catch {
    return {
      header: {},
      payload: {},
      signature: '',
      valid: false,
      error: 'Failed to decode JWT parts',
    };
  }
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

export function htmlEncode(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function htmlDecode(text: string): string {
  const textarea =
    typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
