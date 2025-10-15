import { useState, useEffect } from 'react';
import { useZaplink } from '../ZaplinkProvider';
import type { Transaction } from '@zaplink/core';

export interface UseTransactionsOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Status filter */
  status?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  perPage?: number;
}

export interface UseTransactionsReturn {
  /** Transactions list */
  transactions: Transaction[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Fetch transactions */
  fetch: () => Promise<void>;
  /** Pagination info */
  pagination: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasMore: boolean;
  } | null;
}

/**
 * Hook for fetching transaction history
 */
export function useTransactions(options: UseTransactionsOptions = {}): UseTransactionsReturn {
  const { autoFetch = true, status, page = 1, perPage = 20 } = options;
  const { zaplink } = useZaplink();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseTransactionsReturn['pagination']>(null);

  const fetch = async () => {
    if (!zaplink) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await zaplink.getTransactions({
        status,
        page,
        per_page: perPage,
      });

      if (result.success && result.transactions) {
        setTransactions(result.transactions);
        if (result.pagination) {
          setPagination({
            total: result.pagination.total,
            currentPage: result.pagination.current_page,
            lastPage: result.pagination.last_page,
            hasMore: result.pagination.has_more,
          });
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch transactions');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, status, page, perPage]);

  return {
    transactions,
    isLoading,
    error,
    fetch,
    pagination,
  };
}
