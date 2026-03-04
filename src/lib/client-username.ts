const USERNAME_KEY = 'awo_username';
const USERNAME_EXPIRY_KEY = 'awo_username_expiry';
const SESSION_LENGTH_MS = 1000 * 60 * 60 * 12;

type UsernameResolve = (username: string | null) => void;

export function getStoredUsername(): string | null {
  if (typeof window === 'undefined') return null;

  const username = localStorage.getItem(USERNAME_KEY);
  const expiry = Number(localStorage.getItem(USERNAME_EXPIRY_KEY) || '0');

  if (!username || !expiry || Date.now() > expiry) {
    clearStoredUsername();
    return null;
  }

  return username;
}

export function setStoredUsername(username: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(USERNAME_EXPIRY_KEY, String(Date.now() + SESSION_LENGTH_MS));
}

export function clearStoredUsername() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(USERNAME_EXPIRY_KEY);
}

export async function ensureUsername(): Promise<string | null> {
  const existing = getStoredUsername();
  if (existing) return existing;

  return new Promise((resolve: UsernameResolve) => {
    window.dispatchEvent(
      new CustomEvent('awo:open-auth-modal', {
        detail: { resolve },
      })
    );
  });
}
