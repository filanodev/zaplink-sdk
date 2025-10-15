import React, { HTMLAttributes } from 'react';
import { useZaplink } from '../ZaplinkProvider';

export interface UserBalanceProps extends HTMLAttributes<HTMLDivElement> {
  /** Show Pi symbol */
  showSymbol?: boolean;
  /** Currency symbol */
  symbol?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Render function for custom display */
  render?: (balance: number) => React.ReactNode;
}

/**
 * User Balance Display Component
 */
export function UserBalance({
  showSymbol = true,
  symbol = 'π',
  decimals = 2,
  render,
  className = '',
  ...props
}: UserBalanceProps) {
  const { user, isAuthenticated } = useZaplink();

  if (!isAuthenticated || !user) {
    return null;
  }

  const balance = user.balance || 0;
  const formattedBalance = balance.toFixed(decimals);

  if (render) {
    return <div className={className} {...props}>{render(balance)}</div>;
  }

  return (
    <div className={`user-balance ${className}`} {...props}>
      {formattedBalance} {showSymbol && symbol}
    </div>
  );
}
