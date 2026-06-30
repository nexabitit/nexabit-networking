'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  getDeveloperAccount,
  signupDeveloper,
  loginDeveloper,
  verifyDeveloperEmail,
  logoutDeveloper,
  requestPasswordReset,
  resetPasswordWithCode,
  getPendingResetCode,
  subscribeDeveloper,
  SSR_DEVELOPER_ACCOUNT,
  type DeveloperAccount,
} from '@/lib/developer-session';

export function useDeveloperAccount() {
  const account = useSyncExternalStore(
    subscribeDeveloper,
    getDeveloperAccount,
    () => SSR_DEVELOPER_ACCOUNT,
  );

  const signup = useCallback(
    (input: { email: string; name: string; password: string }) => signupDeveloper(input),
    [],
  );
  const login = useCallback((email: string, password: string) => loginDeveloper(email, password), []);
  const verifyEmail = useCallback((code: string) => verifyDeveloperEmail(code), []);
  const logout = useCallback(() => logoutDeveloper(), []);
  const requestReset = useCallback((email: string) => requestPasswordReset(email), []);
  const resetPassword = useCallback(
    (email: string, code: string, newPassword: string) =>
      resetPasswordWithCode(email, code, newPassword),
    [],
  );

  return {
    account,
    isLoggedIn: account !== null,
    isVerified: account?.emailVerified ?? false,
    signup,
    login,
    verifyEmail,
    logout,
    requestReset,
    resetPassword,
    getPendingResetCode,
  };
}

export type { DeveloperAccount };
