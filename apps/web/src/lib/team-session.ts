export const TEAM_STORAGE_KEY = 'nexabit-team-profile-v1';
export const API_KEY_STORAGE_KEY = 'nexabit-api-key-v1';
export const TEAM_EVENT = 'nexabit-team-update';

export interface TeamProfile {
  name: string;
  ownerEmail: string;
  members: string[];
  updatedAt: number;
}

export interface StoredApiKeyMeta {
  name: string;
  tier: string;
  rateLimit: number;
  createdAt: number;
  /** Only the key prefix is stored for display — full key kept separately */
  prefix: string;
}

const EMPTY_TEAM: TeamProfile = {
  name: '',
  ownerEmail: '',
  members: [],
  updatedAt: 0,
};

function readTeam(): TeamProfile {
  if (typeof window === 'undefined') return EMPTY_TEAM;
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return EMPTY_TEAM;
    return { ...EMPTY_TEAM, ...JSON.parse(raw) } as TeamProfile;
  } catch {
    return EMPTY_TEAM;
  }
}

export function getTeamProfile(): TeamProfile {
  return readTeam();
}

export function saveTeamProfile(profile: Omit<TeamProfile, 'updatedAt'>) {
  if (typeof window === 'undefined') return;
  const data: TeamProfile = { ...profile, updatedAt: Date.now() };
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(TEAM_EVENT));
}

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function saveApiKey(plaintext: string, meta: Omit<StoredApiKeyMeta, 'prefix' | 'createdAt'>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE_KEY, plaintext);
  localStorage.setItem(
    `${API_KEY_STORAGE_KEY}-meta`,
    JSON.stringify({
      ...meta,
      prefix: plaintext.slice(0, 12) + '…',
      createdAt: Date.now(),
    } satisfies StoredApiKeyMeta),
  );
  window.dispatchEvent(new Event(TEAM_EVENT));
}

export function getStoredApiKeyMeta(): StoredApiKeyMeta | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${API_KEY_STORAGE_KEY}-meta`);
    return raw ? (JSON.parse(raw) as StoredApiKeyMeta) : null;
  } catch {
    return null;
  }
}

export function clearStoredApiKey() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(`${API_KEY_STORAGE_KEY}-meta`);
  window.dispatchEvent(new Event(TEAM_EVENT));
}

export function subscribeTeam(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => listener();
  window.addEventListener(TEAM_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(TEAM_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
