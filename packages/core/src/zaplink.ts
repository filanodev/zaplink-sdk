import {
  ZaplinkConfig,
  PiUser,
  AuthResponse,
  PaymentRequest,
  PaymentResponse,
  UserDetailsResponse,
  TransactionHistoryResponse,
  ZaplinkEvent,
  EventCallback,
  ApiRequestOptions,
} from './types';
import { SessionStorage } from './storage';
import { generateHMAC, generateNonce } from './crypto';

/**
 * Main Zaplink SDK class
 */
export class Zaplink {
  private config: Required<ZaplinkConfig>;
  private storage: SessionStorage;
  private currentUser: PiUser | null = null;
  private authToken: string | null = null;
  private eventListeners: Map<ZaplinkEvent, Set<EventCallback>> = new Map();

  constructor(config: ZaplinkConfig) {
    // Validate required config
    if (!config.apiKey) throw new Error('apiKey is required');
    if (!config.secretKey) throw new Error('secretKey is required');
    if (!config.appId) throw new Error('appId is required');

    // Set default config
    this.config = {
      apiKey: config.apiKey,
      secretKey: config.secretKey,
      appId: config.appId,
      baseUrl: config.baseUrl || 'https://app.zaplink.filano.dev',
      callbackUrl: config.callbackUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
      environment: config.environment || 'production',
      debug: config.debug || false,
    };

    // Initialize storage
    this.storage = new SessionStorage(this.config.apiKey);

    // Try to load existing session
    const session = this.storage.loadSession();
    if (session) {
      this.currentUser = session.user;
      this.authToken = session.token;
    }

    this.log('Zaplink SDK initialized', this.config);
  }

  /**
   * Login with Pi Network
   */
  async login(): Promise<AuthResponse> {
    try {
      this.log('Initiating Pi Network login...');

      const response = await fetch(`${this.config.baseUrl}/api/auth/pi-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          application_id: this.config.appId,
          scopes: 'username,payments,wallet_address',
          callback_url: this.config.callbackUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.auth_url) {
        this.log('Auth URL received', data.auth_url);

        // Redirect to auth URL in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = data.auth_url;
        }

        return data;
      }

      throw new Error(data.message || 'Failed to get auth URL');
    } catch (error) {
      this.log('Login failed', error, true);
      this.emit('auth:error', { error });
      throw error;
    }
  }

  /**
   * Handle authentication callback
   */
  async handleAuthCallback(callbackToken: string): Promise<boolean> {
    try {
      this.log('Processing auth callback...');

      const timestamp = Math.floor(Date.now() / 1000);
      const payload = `${this.config.apiKey}|${callbackToken}|${timestamp}`;
      const signature = await generateHMAC(payload, this.config.secretKey);

      const response = await fetch(
        `${this.config.baseUrl}/api/secure/auth/validate-callback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            api_key: this.config.apiKey,
            callback_token: callbackToken,
            signature,
            timestamp,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.app_token) {
        this.authToken = data.app_token;
        this.currentUser = data.user;
        this.storage.saveSession(data.user, data.app_token);

        this.log('Auth callback successful', data.user);
        this.emit('auth:success', { user: data.user });

        return true;
      }

      return false;
    } catch (error) {
      this.log('Auth callback failed', error, true);
      this.emit('auth:error', { error });
      return false;
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.currentUser = null;
    this.authToken = null;
    this.storage.clearSession();
    this.log('User logged out');
    this.emit('auth:logout', {});
  }

  /**
   * Get current user
   */
  getUser(): PiUser | null {
    return this.currentUser;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.authToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  /**
   * Get user details from API
   */
  async getUserDetails(): Promise<PiUser | null> {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    try {
      this.log('Fetching user details...');

      const response = await this.makeAuthenticatedRequest('/api/app/user-details', {
        token: this.authToken,
        application_id: this.config.appId,
      });

      const data: UserDetailsResponse = await response.json();

      if (data.success && data.user) {
        this.currentUser = { ...this.currentUser, ...data.user } as PiUser;
        this.storage.saveSession(this.currentUser, this.authToken);
        this.emit('user:updated', { user: this.currentUser });
        return this.currentUser;
      }

      return null;
    } catch (error) {
      this.log('Failed to get user details', error, true);
      throw error;
    }
  }

  /**
   * Create a payment
   */
  async makePayment(amount: number, memo?: string): Promise<PaymentResponse> {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    try {
      this.log('Creating payment...', { amount, memo });

      const response = await this.makeAuthenticatedRequest('/api/app/make-payment', {
        token: this.authToken,
        application_id: this.config.appId,
        amount,
        memo: memo || `Payment via Zaplink SDK`,
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.payment_url) {
        this.log('Payment created', data);
        this.emit('payment:created', data);
        return data;
      }

      throw new Error(data.message || 'Payment creation failed');
    } catch (error) {
      this.log('Payment creation failed', error, true);
      this.emit('payment:failed', { error });
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(filters?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<TransactionHistoryResponse> {
    if (!this.authToken) {
      throw new Error('Not authenticated');
    }

    try {
      this.log('Fetching transactions...', filters);

      const params = new URLSearchParams(filters as any).toString();
      const url = `/api/user/transactions${params ? '?' + params : ''}`;

      const response = await fetch(`${this.config.baseUrl}${url}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.log('Failed to fetch transactions', error, true);
      throw error;
    }
  }

  /**
   * Make authenticated API request with HMAC signature
   */
  private async makeAuthenticatedRequest(
    endpoint: string,
    bodyData: Record<string, any>
  ): Promise<Response> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = generateNonce();
    const bodyString = JSON.stringify(bodyData);

    // Build string to sign: METHOD\nPATH\nTIMESTAMP\nNONCE\nBODY
    const method = 'POST';
    const path = endpoint.substring(1); // Remove leading slash
    const dataToSign = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyString}`;

    const signature = await generateHMAC(dataToSign, this.config.secretKey);

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-API-Signature': signature,
      'X-API-Timestamp': timestamp.toString(),
      'X-API-Nonce': nonce,
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };

    return fetch(`${this.config.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: bodyString,
    });
  }

  /**
   * Event emitter - on
   */
  on(event: ZaplinkEvent, callback: EventCallback): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(event)?.delete(callback);
    };
  }

  /**
   * Event emitter - emit
   */
  private emit(event: ZaplinkEvent, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.log(`Error in event listener for ${event}`, error, true);
        }
      });
    }
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any, isError = false): void {
    if (!this.config.debug) return;

    const prefix = isError ? '❌ Zaplink' : '✅ Zaplink';
    if (data) {
      console.log(`${prefix}: ${message}`, data);
    } else {
      console.log(`${prefix}: ${message}`);
    }
  }
}
