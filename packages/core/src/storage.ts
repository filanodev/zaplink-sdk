import { PiUser } from './types';
import { encryptData, decryptData } from './crypto';

/**
 * Storage interface for session management
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Default localStorage adapter
 */
class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

/**
 * Session data interface
 */
interface SessionData {
  user: PiUser;
  token: string;
  expires: number;
  created: number;
}

/**
 * Session storage manager
 */
export class SessionStorage {
  private storageKey: string;
  private encryptionKey: string;
  private adapter: StorageAdapter;
  private sessionTimeout: number;

  constructor(
    apiKey: string,
    adapter?: StorageAdapter,
    sessionTimeout: number = 4 * 60 * 60 * 1000 // 4 hours
  ) {
    this.storageKey = `zaplink_${btoa(apiKey).slice(0, 8)}`;
    this.encryptionKey = apiKey.slice(-16);
    this.adapter = adapter || new LocalStorageAdapter();
    this.sessionTimeout = sessionTimeout;
  }

  /**
   * Save session
   */
  saveSession(user: PiUser, token: string): void {
    const sessionData: SessionData = {
      user,
      token,
      expires: Date.now() + this.sessionTimeout,
      created: Date.now(),
    };

    const encrypted = encryptData(sessionData, this.encryptionKey);
    this.adapter.setItem(this.storageKey, encrypted);
  }

  /**
   * Load session
   */
  loadSession(): { user: PiUser; token: string } | null {
    try {
      const encrypted = this.adapter.getItem(this.storageKey);
      if (!encrypted) return null;

      const sessionData = decryptData(encrypted, this.encryptionKey) as SessionData;

      // Check expiration
      if (Date.now() > sessionData.expires) {
        this.clearSession();
        return null;
      }

      return {
        user: sessionData.user,
        token: sessionData.token,
      };
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.adapter.removeItem(this.storageKey);
  }

  /**
   * Check if session exists and is valid
   */
  hasValidSession(): boolean {
    return this.loadSession() !== null;
  }
}
