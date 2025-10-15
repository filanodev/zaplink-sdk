import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Zaplink } from '@zaplink/core';
import type { ZaplinkConfig, PiUser, PaymentResponse } from '@zaplink/core';

interface ZaplinkContextValue {
  zaplink: Zaplink | null;
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  makePayment: (amount: number, memo?: string) => Promise<PaymentResponse>;
  refreshUser: () => Promise<void>;
}

const ZaplinkContext = createContext<ZaplinkContextValue | undefined>(undefined);

export interface ZaplinkProviderProps extends ZaplinkConfig {
  children: ReactNode;
  onAuthSuccess?: (user: PiUser) => void;
  onAuthError?: (error: Error) => void;
  onLogout?: () => void;
  autoHandleCallback?: boolean;
}

/**
 * Zaplink Provider Component
 * Wraps your app and provides Zaplink context
 */
export function ZaplinkProvider({
  children,
  onAuthSuccess,
  onAuthError,
  onLogout,
  autoHandleCallback = true,
  ...config
}: ZaplinkProviderProps) {
  const [zaplink] = useState(() => new Zaplink(config));
  const [user, setUser] = useState<PiUser | null>(zaplink.getUser());
  const [isLoading, setIsLoading] = useState(false);

  // Auto-handle auth callback
  useEffect(() => {
    if (!autoHandleCallback) return;

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const callbackToken = urlParams.get('callback_token');
      const status = urlParams.get('status');

      if (callbackToken && status === 'success') {
        setIsLoading(true);
        try {
          const success = await zaplink.handleAuthCallback(callbackToken);
          if (success) {
            const user = zaplink.getUser();
            setUser(user);

            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Auth callback error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [zaplink, autoHandleCallback]);

  // Event listeners
  useEffect(() => {
    const unsubscribeAuthSuccess = zaplink.on('auth:success', (data) => {
      setUser(data.user);
      onAuthSuccess?.(data.user);
    });

    const unsubscribeAuthError = zaplink.on('auth:error', (data) => {
      onAuthError?.(data.error);
    });

    const unsubscribeLogout = zaplink.on('auth:logout', () => {
      setUser(null);
      onLogout?.();
    });

    const unsubscribeUserUpdated = zaplink.on('user:updated', (data) => {
      setUser(data.user);
    });

    return () => {
      unsubscribeAuthSuccess();
      unsubscribeAuthError();
      unsubscribeLogout();
      unsubscribeUserUpdated();
    };
  }, [zaplink, onAuthSuccess, onAuthError, onLogout]);

  const login = async () => {
    setIsLoading(true);
    try {
      await zaplink.login();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    zaplink.logout();
    setUser(null);
  };

  const makePayment = async (amount: number, memo?: string): Promise<PaymentResponse> => {
    setIsLoading(true);
    try {
      const result = await zaplink.makePayment(amount, memo);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const updatedUser = await zaplink.getUserDetails();
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const value: ZaplinkContextValue = {
    zaplink,
    user,
    isAuthenticated: zaplink.isAuthenticated(),
    isLoading,
    login,
    logout,
    makePayment,
    refreshUser,
  };

  return <ZaplinkContext.Provider value={value}>{children}</ZaplinkContext.Provider>;
}

/**
 * Hook to access Zaplink context
 */
export function useZaplink(): ZaplinkContextValue {
  const context = useContext(ZaplinkContext);
  if (!context) {
    throw new Error('useZaplink must be used within a ZaplinkProvider');
  }
  return context;
}
