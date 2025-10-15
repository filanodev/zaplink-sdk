import { useState } from 'react';
import { useZaplink } from '../ZaplinkProvider';
import type { PaymentResponse } from '@zaplink/core';

export interface UsePaymentReturn {
  /** Create a payment */
  createPayment: (amount: number, memo?: string) => Promise<PaymentResponse | null>;
  /** Payment response */
  payment: PaymentResponse | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for creating payments
 */
export function usePayment(): UsePaymentReturn {
  const { makePayment } = useZaplink();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPayment = async (amount: number, memo?: string): Promise<PaymentResponse | null> => {
    setIsLoading(true);
    setError(null);
    setPayment(null);

    try {
      const result = await makePayment(amount, memo);
      setPayment(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPayment(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    createPayment,
    payment,
    isLoading,
    error,
    reset,
  };
}
