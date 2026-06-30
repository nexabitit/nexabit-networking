import type { ApiTier } from '@nexabit/shared';

export const DEVELOPER_STORAGE_KEY = 'nexabit-developer-account-v1';
export const DEVELOPER_EVENT = 'nexabit-developer-update';
export const VERIFY_CODE_KEY = 'nexabit-verify-code';
export const VERIFY_EMAIL_KEY = 'nexabit-verify-email';
export const RESET_CODE_KEY = 'nexabit-reset-code';
export const RESET_EMAIL_KEY = 'nexabit-reset-email';

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

/** Stable null snapshot for SSR — must not allocate new objects per read */
export const SSR_DEVELOPER_ACCOUNT: DeveloperAccount | null = null;

let cachedAccountJson: string | null | undefined;
let cachedAccount: DeveloperAccount | null = null;

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readAccount(): DeveloperAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEVELOPER_STORAGE_KEY);
    if (raw === cachedAccountJson) return cachedAccount;
    cachedAccountJson = raw;
    cachedAccount = raw ? (JSON.parse(raw) as DeveloperAccount) : null;
    return cachedAccount;
  } catch {
    cachedAccountJson = null;
    cachedAccount = null;
    return null;
  }
}

function writeAccount(account: DeveloperAccount | null) {
  if (typeof window === 'undefined') return;
  if (account) {
    const json = JSON.stringify(account);
    localStorage.setItem(DEVELOPER_STORAGE_KEY, json);
    cachedAccountJson = json;
    cachedAccount = account;
  } else {
    localStorage.removeItem(DEVELOPER_STORAGE_KEY);
    cachedAccountJson = null;
    cachedAccount = null;
  }
  window.dispatchEvent(new Event(DEVELOPER_EVENT));
}

export function getDeveloperAccount(): DeveloperAccount | null {
  return readAccount();
}

export function getPendingVerificationCode(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(VERIFY_CODE_KEY);
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
  sessionStorage.setItem(VERIFY_CODE_KEY, verificationCode);
  sessionStorage.setItem(VERIFY_EMAIL_KEY, email);
  return { ok: true, verificationCode };
}

export async function loginDeveloper(
  email: string,
  password: string,
): Promise<{ ok: true; needsVerification: boolean } | { ok: false; error: string }> {
  const account = readAccount();
  const normalized = email.trim().toLowerCase();
  if (!account || account.email !== normalized) {
    return { ok: false, error: 'No account found. Sign up first.' };
  }
  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    return { ok: false, error: 'Incorrect password.' };
  }
  return { ok: true, needsVerification: !account.emailVerified };
}

export function verifyDeveloperEmail(code: string): boolean {
  const account = readAccount();
  if (!account) return false;
  const expected = sessionStorage.getItem(VERIFY_CODE_KEY);
  const email = sessionStorage.getItem(VERIFY_EMAIL_KEY);
  if (!expected || email !== account.email) return false;
  if (code.trim() !== expected) return false;

  writeAccount({ ...account, emailVerified: true });
  sessionStorage.removeItem(VERIFY_CODE_KEY);
  sessionStorage.removeItem(VERIFY_EMAIL_KEY);
  return true;
}

export function logoutDeveloper() {
  writeAccount(null);
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(VERIFY_CODE_KEY);
    sessionStorage.removeItem(VERIFY_EMAIL_KEY);
    sessionStorage.removeItem(RESET_CODE_KEY);
    sessionStorage.removeItem(RESET_EMAIL_KEY);
  }
}

export async function requestPasswordReset(
  email: string,
): Promise<{ ok: true; resetCode: string } | { ok: false; error: string }> {
  const account = readAccount();
  const normalized = email.trim().toLowerCase();
  if (!account || account.email !== normalized) {
    return { ok: false, error: 'No developer account found for that email. Sign up first.' };
  }
  const resetCode = String(Math.floor(100000 + Math.random() * 900000));
  sessionStorage.setItem(RESET_CODE_KEY, resetCode);
  sessionStorage.setItem(RESET_EMAIL_KEY, normalized);
  return { ok: true, resetCode };
}

export function getPendingResetCode(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(RESET_CODE_KEY);
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const account = readAccount();
  const normalized = email.trim().toLowerCase();
  if (!account || account.email !== normalized) {
    return { ok: false, error: 'Account not found.' };
  }
  const expected = sessionStorage.getItem(RESET_CODE_KEY);
  const resetEmail = sessionStorage.getItem(RESET_EMAIL_KEY);
  if (!expected || resetEmail !== normalized || code.trim() !== expected) {
    return { ok: false, error: 'Invalid or expired reset code.' };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  const passwordHash = await hashPassword(newPassword);
  writeAccount({ ...account, passwordHash });
  sessionStorage.removeItem(RESET_CODE_KEY);
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  return { ok: true };
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
