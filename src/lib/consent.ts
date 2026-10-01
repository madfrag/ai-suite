// Bump when the Datenschutz text changes in a way that needs fresh consent;
// everyone who agreed to an older version is asked again.
export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'ai-suite-consent';

export type ConsentStatus = 'unknown' | 'required' | 'granted';

const listeners = new Set<() => void>();
let memoryGranted = false;

export function readConsent(): Exclude<ConsentStatus, 'unknown'> {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return 'required';
    const parsed = JSON.parse(raw) as { v?: number };
    return parsed.v === CONSENT_VERSION ? 'granted' : 'required';
  } catch {
    // Storage blocked or value corrupt — treat as not consented.
    return 'required';
  }
}

export function grantConsent() {
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ v: CONSENT_VERSION, at: new Date().toISOString() })
    );
  } catch {
    // Storage unavailable: consent only lasts for this page view.
    memoryGranted = true;
  }
  listeners.forEach((l) => l());
}

export function getConsentSnapshot(): Exclude<ConsentStatus, 'unknown'> {
  return memoryGranted ? 'granted' : readConsent();
}

export function getConsentServerSnapshot(): ConsentStatus {
  return 'unknown';
}

export function subscribeConsent(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_STORAGE_KEY || e.key === null) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}
