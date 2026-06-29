import type { ApiTier } from '@nexabit/shared';

export const DEVELOPER_STORAGE_KEY = 'nexabit-developer-account-v1';
export const DEVELOPER_EVENT = 'nexabit-developer-update';

export type DeveloperRole = 'developer' | 'admin';

export interface DeveloperAccount {
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  plan: ApiTier;
  role: DeveloperRole;
  createdAt: number;
}

const EMPTY: DeveloperAccount | null = null;

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readAccount(): DeveloperAccount | null {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(DEVELOPER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeveloperAccount) : null;
  } catch {
    return null;
  }
}

function writeAccount(account: DeveloperAccount | null) {
  if (typeof window === 'undefined') return;
  if (account) {
    localStorage.setItem(DEVELOPER_STORAGE_KEY, JSON.stringify(account));
  } else {
    localStorage.removeItem(DEVELOPER_STORAGE_KEY);
  }
  window.dispatchEvent(new Event(DEVELOPER_EVENT));
}

export function getDeveloperAccount(): DeveloperAccount | null {
  return readAccount();
}

export function isDeveloperLoggedIn(): boolean {
  return readAccount() !== null;
}

export function isEmailVerified(): boolean {
  return readAccount()?.emailVerified ?? false;
}

export async function signupDeveloper(input: {
  email: string;
  name: string;
  password: string;
}): Promise<{ ok: true; verificationCode: string } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.name.trim() || input.password.length < 8) {
    return { ok: false, error: 'Name, valid email, and password (8+ chars) are required.' };
  }

  const passwordHash = await hashPassword(input.password);
  const verificationCode = String(Math.floor(100000 + Math.random() * 900000));

  const account: DeveloperAccount = {
    email,
    name: input.name.trim(),
    passwordHash,
    emailVerified: false,
    plan: 'free',
    role: email.endsWith('@nexabitit.com') ? 'admin' : 'developer',
    createdAt: Date.now(),
  };

  writeAccount(account);
  sessionStorage.setItem('nexabit-verify-code', verificationCode);
  sessionStorage.setItem('nexabit-verify-email', email);
  return { ok: true, verificationCode };
}

export async function loginDeveloper(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const account = readAccount();
  if (!account || account.email !== email.trim().toLowerCase()) {
    return { ok: false, error: 'No account found. Sign up first.' };
  }
  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: 'Incorrect password.' };
  }
  return { ok: true };
}

export function verifyDeveloperEmail(code: string): boolean {
  const account = readAccount();
  if (!account) return false;
  const expected = sessionStorage.getItem('nexabit-verify-code');
  const email = sessionStorage.getItem('nexabit-verify-email');
  if (!expected || email !== account.email) return false;
  if (code.trim() !== expected) return false;

  writeAccount({ ...account, emailVerified: true });
  sessionStorage.removeItem('nexabit-verify-code');
  sessionStorage.removeItem('nexabit-verify-email');
  return true;
}

export function logoutDeveloper() {
  writeAccount(null);
}

export function subscribeDeveloper(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener();
  window.addEventListener(DEVELOPER_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(DEVELOPER_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
