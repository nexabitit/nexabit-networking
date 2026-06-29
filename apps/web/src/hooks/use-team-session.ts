'use client';

import { useSyncExternalStore, useCallback } from 'react';
import {
  getTeamProfile,
  saveTeamProfile,
  getStoredApiKey,
  getStoredApiKeyMeta,
  saveApiKey,
  clearStoredApiKey,
  subscribeTeam,
  type TeamProfile,
  type StoredApiKeyMeta,
} from '@/lib/team-session';

const EMPTY_TEAM: TeamProfile = {
  name: '',
  ownerEmail: '',
  members: [],
  updatedAt: 0,
};

export function useTeamProfile() {
  const profile = useSyncExternalStore(subscribeTeam, getTeamProfile, () => EMPTY_TEAM);
  const save = useCallback((p: Omit<TeamProfile, 'updatedAt'>) => saveTeamProfile(p), []);
  return { profile, save };
}

export function useStoredApiKey() {
  const key = useSyncExternalStore(
    subscribeTeam,
    () => getStoredApiKey(),
    () => null,
  );
  const meta = useSyncExternalStore(
    subscribeTeam,
    () => getStoredApiKeyMeta(),
    () => null,
  );
  const store = useCallback(
    (plaintext: string, m: Omit<StoredApiKeyMeta, 'prefix' | 'createdAt'>) =>
      saveApiKey(plaintext, m),
    [],
  );
  const clear = useCallback(() => clearStoredApiKey(), []);
  return { key, meta, store, clear };
}
