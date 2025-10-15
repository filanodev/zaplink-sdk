# @zaplink/core

> Core Zaplink SDK for vanilla JavaScript

The core SDK provides all the fundamental functionality for integrating Pi Network authentication and payments into your JavaScript applications.

## Installation

```bash
npm install @zaplink/core
```

## Quick Start

```javascript
import Zaplink from '@zaplink/core';

// Initialize the SDK
const zaplink = new Zaplink({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  appId: 'your-app-id',
  environment: 'production', // or 'sandbox'
  debug: true, // Enable debug logging
});

// Login with Pi Network
await zaplink.login();

// Handle callback (after redirect from Pi Network)
const urlParams = new URLSearchParams(window.location.search);
const callbackToken = urlParams.get('callback_token');
if (callbackToken) {
  await zaplink.handleAuthCallback(callbackToken);
}

// Get current user
const user = zaplink.getUser();
console.log('User:', user);

// Make a payment
const payment = await zaplink.makePayment(10, 'Payment for service');
console.log('Payment URL:', payment.payment_url);

// Get user details
const userDetails = await zaplink.getUserDetails();

// Get transaction history
const transactions = await zaplink.getTransactions({
  status: 'completed',
  page: 1,
  per_page: 20,
});

// Logout
zaplink.logout();
```

## Event Listeners

The SDK emits events that you can listen to:

```javascript
// Authentication events
zaplink.on('auth:success', (data) => {
  console.log('User authenticated:', data.user);
});

zaplink.on('auth:error', (data) => {
  console.error('Auth error:', data.error);
});

zaplink.on('auth:logout', () => {
  console.log('User logged out');
});

// Payment events
zaplink.on('payment:created', (data) => {
  console.log('Payment created:', data);
});

zaplink.on('payment:completed', (data) => {
  console.log('Payment completed:', data);
});

zaplink.on('payment:failed', (data) => {
  console.error('Payment failed:', data);
});

// User events
zaplink.on('user:updated', (data) => {
  console.log('User updated:', data.user);
});
```

## API Reference

### Constructor

```typescript
new Zaplink(config: ZaplinkConfig)
```

**Config Options:**
- `apiKey` (string, required): Your Zaplink API key
- `secretKey` (string, required): Your Zaplink secret key
- `appId` (string, required): Your application ID
- `baseUrl` (string, optional): API base URL (default: 'https://app.zaplink.filano.dev')
- `callbackUrl` (string, optional): Callback URL for authentication (default: current origin)
- `environment` (string, optional): 'production' or 'sandbox' (default: 'production')
- `debug` (boolean, optional): Enable debug logging (default: false)

### Methods

#### `login(): Promise<AuthResponse>`
Initiates the Pi Network authentication flow. Redirects the user to Pi Network login page.

#### `handleAuthCallback(callbackToken: string): Promise<boolean>`
Handles the authentication callback after user returns from Pi Network.

#### `logout(): void`
Logs out the current user and clears the session.

#### `getUser(): PiUser | null`
Returns the current authenticated user or null.

#### `getToken(): string | null`
Returns the current authentication token or null.

#### `isAuthenticated(): boolean`
Returns true if the user is authenticated.

#### `getUserDetails(): Promise<PiUser | null>`
Fetches the latest user details from the API.

#### `makePayment(amount: number, memo?: string): Promise<PaymentResponse>`
Creates a payment request.

#### `getTransactions(filters?): Promise<TransactionHistoryResponse>`
Fetches transaction history with optional filters.

#### `on(event: ZaplinkEvent, callback: EventCallback): () => void`
Subscribes to an event. Returns an unsubscribe function.

## TypeScript Support

This package is written in TypeScript and includes full type definitions.

```typescript
import Zaplink, { PiUser, PaymentResponse, ZaplinkConfig } from '@zaplink/core';

const config: ZaplinkConfig = {
  apiKey: 'xxx',
  secretKey: 'xxx',
  appId: 'xxx',
};

const zaplink = new Zaplink(config);
```

## Browser & Node.js Support

The SDK works in both browser and Node.js environments:
- **Browser**: Uses Web Crypto API for HMAC signatures
- **Node.js**: Uses native crypto module

## Session Management

The SDK automatically manages user sessions using encrypted localStorage (in browser) or memory storage (in Node.js). Sessions expire after 4 hours by default.

## License

MIT © Zaplink
