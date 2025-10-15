import React, { HTMLAttributes } from 'react';
import { useZaplink } from '../ZaplinkProvider';

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  /** Show username */
  showUsername?: boolean;
  /** Show balance */
  showBalance?: boolean;
  /** Show logout button */
  showLogout?: boolean;
  /** Logout button text */
  logoutText?: string;
  /** Custom render function */
  render?: (user: any, logout: () => void) => React.ReactNode;
}

/**
 * User Profile Component
 */
export function UserProfile({
  showUsername = true,
  showBalance = true,
  showLogout = true,
  logoutText = 'Logout',
  render,
  className = '',
  ...props
}: UserProfileProps) {
  const { user, logout, isAuthenticated } = useZaplink();

  if (!isAuthenticated || !user) {
    return null;
  }

  if (render) {
    return <div className={className} {...props}>{render(user, logout)}</div>;
  }

  return (
    <div className={`user-profile ${className}`} {...props}>
      {showUsername && user.username && (
        <div className="user-profile-username">
          {user.username}
        </div>
      )}

      {showBalance && (
        <div className="user-profile-balance">
          {user.balance || 0} π
        </div>
      )}

      {showLogout && (
        <button
          onClick={logout}
          className="user-profile-logout"
        >
          {logoutText}
        </button>
      )}
    </div>
  );
}
