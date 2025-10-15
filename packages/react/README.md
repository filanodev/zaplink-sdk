# @zaplink/react

> Zaplink SDK for React - Hooks and components for easy Pi Network integration

## Installation

```bash
npm install @zaplink/react
```

## Quick Start

### 1. Wrap your app with ZaplinkProvider

```jsx
import { ZaplinkProvider } from '@zaplink/react';

function App() {
  return (
    <ZaplinkProvider
      apiKey="your-api-key"
      secretKey="your-secret-key"
      appId="your-app-id"
      environment="production"
    >
      <YourApp />
    </ZaplinkProvider>
  );
}
```

### 2. Use the useZaplink hook

```jsx
import { useZaplink } from '@zaplink/react';

function YourApp() {
  const { user, isAuthenticated, login, logout, makePayment } = useZaplink();

  if (!isAuthenticated) {
    return <button onClick={login}>Login with Pi</button>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Balance: {user.balance} π</p>
      <button onClick={() => makePayment(10, 'Test payment')}>
        Pay 10 Pi
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Components

### PiLoginButton

Pre-built login button:

```jsx
import { PiLoginButton } from '@zaplink/react';

function MyComponent() {
  return (
    <PiLoginButton
      loginText="Connect with Pi"
      loadingText="Connecting..."
      className="my-button-class"
    />
  );
}
```

### UserBalance

Display user balance:

```jsx
import { UserBalance } from '@zaplink/react';

function MyComponent() {
  return (
    <UserBalance
      showSymbol={true}
      decimals={2}
      className="balance-display"
    />
  );
}
```

### UserProfile

Complete user profile with balance and logout:

```jsx
import { UserProfile } from '@zaplink/react';

function MyComponent() {
  return (
    <UserProfile
      showUsername={true}
      showBalance={true}
      showLogout={true}
      logoutText="Sign Out"
    />
  );
}
```

## Hooks

### useZaplink

Main hook for accessing Zaplink functionality:

```jsx
const {
  zaplink,        // Zaplink instance
  user,           // Current user
  isAuthenticated, // Auth status
  isLoading,      // Loading state
  login,          // Login function
  logout,         // Logout function
  makePayment,    // Payment function
  refreshUser     // Refresh user data
} = useZaplink();
```

### usePayment

Hook for creating payments:

```jsx
import { usePayment } from '@zaplink/react';

function PaymentComponent() {
  const { createPayment, payment, isLoading, error } = usePayment();

  const handlePay = async () => {
    const result = await createPayment(10, 'Payment for service');
    if (result) {
      console.log('Payment URL:', result.payment_url);
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay 10 Pi'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {payment && <a href={payment.payment_url}>Complete Payment</a>}
    </div>
  );
}
```

### useTransactions

Hook for fetching transaction history:

```jsx
import { useTransactions } from '@zaplink/react';

function TransactionHistory() {
  const { transactions, isLoading, pagination, fetch } = useTransactions({
    autoFetch: true,
    status: 'completed',
    page: 1,
    perPage: 20
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {transactions.map(tx => (
        <div key={tx.id}>
          {tx.amount} π - {tx.status}
        </div>
      ))}
      {pagination && (
        <p>Page {pagination.currentPage} of {pagination.lastPage}</p>
      )}
    </div>
  );
}
```

## Event Handling

Handle authentication events:

```jsx
<ZaplinkProvider
  apiKey="..."
  secretKey="..."
  appId="..."
  onAuthSuccess={(user) => console.log('Logged in:', user)}
  onAuthError={(error) => console.error('Auth error:', error)}
  onLogout={() => console.log('Logged out')}
>
  <App />
</ZaplinkProvider>
```

## TypeScript Support

Full TypeScript support with type definitions:

```tsx
import { ZaplinkProvider, useZaplink, PiUser } from '@zaplink/react';

function MyComponent() {
  const { user, login } = useZaplink();

  // user is typed as PiUser | null
  if (user) {
    console.log(user.username); // TypeScript knows this exists
  }
}
```

## License

MIT © Zaplink
