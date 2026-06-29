'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  getDeveloperAccount,
  signupDeveloper,
  loginDeveloper,
  verifyDeveloperEmail,
  logoutDeveloper,
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

  return {
    account,
    isLoggedIn: account !== null,
    isVerified: account?.emailVerified ?? false,
    signup,
    login,
    verifyEmail,
    logout,
  };
}

export type { DeveloperAccount };
