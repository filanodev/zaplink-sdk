/**
 * Zaplink SDK Configuration
 */
export interface ZaplinkConfig {
  /** Zaplink API key */
  apiKey: string;
  /** Zaplink secret key for HMAC signing */
  secretKey: string;
  /** Application ID */
  appId: string;
  /** API base URL */
  baseUrl?: string;
  /** Callback URL for authentication */
  callbackUrl?: string;
  /** Environment (production or sandbox) */
  environment?: 'production' | 'sandbox';
  /** Debug mode */
  debug?: boolean;
}

/**
 * Pi Network User
 */
export interface PiUser {
  /** User ID */
  id?: string | number;
  /** Pi username */
  username: string;
  /** Pi user ID */
  pi_username?: string;
  /** Pi UID */
  pi_uid?: string;
  /** Wallet address */
  wallet_address?: string;
  /** User balance in Pi */
  balance: number;
  /** User name */
  name?: string;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  success: boolean;
  auth_url?: string;
  state?: string;
  expires_in?: number;
  user?: PiUser;
  token?: string;
  app_token?: string;
  access_token?: string;
  error?: string;
  message?: string;
}

/**
 * Payment Request
 */
export interface PaymentRequest {
  /** Amount in Pi */
  amount: number;
  /** Payment memo/description */
  memo?: string;
  /** Metadata object */
  metadata?: Record<string, any>;
}

/**
 * Payment Response
 */
export interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  transaction_id?: string;
  payment_id?: string;
  error?: string;
  message?: string;
}

/**
 * Transaction
 */
export interface Transaction {
  id: string | number;
  transaction_id: string;
  payment_id?: string;
  type: 'payment' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  txid?: string;
  memo?: string;
  application?: {
    id: string | number;
    name: string;
  };
  created_at: string;
  completed_at?: string;
}

/**
 * User Details Response
 */
export interface UserDetailsResponse {
  success: boolean;
  user?: PiUser;
  error?: string;
  message?: string;
}

/**
 * Transaction History Response
 */
export interface TransactionHistoryResponse {
  success: boolean;
  transactions?: Transaction[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
  };
  stats?: {
    total_amount: number;
    total_transactions: number;
    completed_count: number;
    pending_count: number;
    failed_count: number;
  };
  error?: string;
  message?: string;
}

/**
 * Zaplink SDK Events
 */
export type ZaplinkEvent =
  | 'auth:success'
  | 'auth:error'
  | 'auth:logout'
  | 'payment:created'
  | 'payment:completed'
  | 'payment:failed'
  | 'payment:cancelled'
  | 'user:updated'
  | 'error';

/**
 * Event callback function
 */
export type EventCallback = (data: any) => void;

/**
 * API Request Options
 */
export interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
}
