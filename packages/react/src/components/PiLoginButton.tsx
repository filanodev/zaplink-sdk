import React, { ButtonHTMLAttributes } from 'react';
import { useZaplink } from '../ZaplinkProvider';

export interface PiLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button text when not authenticated */
  loginText?: string;
  /** Button text when loading */
  loadingText?: string;
  /** Show loading state */
  showLoading?: boolean;
}

/**
 * Pre-built Pi Login Button component
 */
export function PiLoginButton({
  loginText = 'Login with Pi',
  loadingText = 'Connecting...',
  showLoading = true,
  className = '',
  disabled,
  children,
  ...props
}: PiLoginButtonProps) {
  const { login, isLoading, isAuthenticated } = useZaplink();

  if (isAuthenticated) {
    return null;
  }

  const handleClick = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const isDisabled = disabled || isLoading;
  const buttonText = children || (isLoading && showLoading ? loadingText : loginText);

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`pi-login-button ${className}`}
      {...props}
    >
      {buttonText}
    </button>
  );
}
