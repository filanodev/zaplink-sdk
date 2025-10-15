/**
 * Zaplink SDK - React Package
 * React hooks and components for Pi Network integration
 */

export { ZaplinkProvider, useZaplink } from './ZaplinkProvider';
export type { ZaplinkProviderProps } from './ZaplinkProvider';

// Components
export { PiLoginButton } from './components/PiLoginButton';
export type { PiLoginButtonProps } from './components/PiLoginButton';

export { UserBalance } from './components/UserBalance';
export type { UserBalanceProps } from './components/UserBalance';

export { UserProfile } from './components/UserProfile';
export type { UserProfileProps } from './components/UserProfile';

// Hooks
export { usePayment } from './hooks/usePayment';
export type { UsePaymentReturn } from './hooks/usePayment';

export { useTransactions } from './hooks/useTransactions';
export type { UseTransactionsReturn, UseTransactionsOptions } from './hooks/useTransactions';

// Re-export types from core
export type { PiUser, PaymentResponse, Transaction, ZaplinkConfig } from '@zaplink/core';
