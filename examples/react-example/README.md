# Zaplink SDK - React Example

This is a complete example application demonstrating the Zaplink SDK for React.

## Features Demonstrated

- ✅ Pi Network authentication
- ✅ User profile display
- ✅ Balance management
- ✅ Payment creation
- ✅ Event handling
- ✅ Pre-built components
- ✅ Custom hooks

## Running the Example

```bash
# From the root of the monorepo
cd examples/react-example

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
react-example/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Configuration

The example uses these credentials (from TestApp):

```javascript
{
  apiKey: 'zap_501ff4000cc8d1d0e47becef74b777fbc4ff73ff73b336ff2553ef5873456dcd',
  secretKey: 'sk_b5dbd1cd8b0e5200752cb20e59f71f359fa712a55b4a99c076c1c290785107ee',
  appId: '5',
  environment: 'production',
  debug: true
}
```

## What You'll Learn

1. **Setting up ZaplinkProvider** - How to configure and wrap your app
2. **Using hooks** - `useZaplink`, `usePayment`, `useTransactions`
3. **Pre-built components** - `PiLoginButton`, `UserProfile`, `UserBalance`
4. **Event handling** - `onAuthSuccess`, `onAuthError`, `onLogout`
5. **Making payments** - How to create and handle Pi Network payments
6. **Refreshing user data** - Fetching latest balance and user info

## Code Highlights

### Authentication

```jsx
const { user, isAuthenticated, login } = useZaplink();

if (!isAuthenticated) {
  return <PiLoginButton />;
}
```

### Creating Payments

```jsx
const { createPayment, payment, isLoading } = usePayment();

const handlePay = async () => {
  const result = await createPayment(10, 'Test payment');
  if (result) {
    window.open(result.payment_url, '_blank');
  }
};
```

### Displaying User Info

```jsx
<UserProfile
  showUsername={true}
  showBalance={true}
  showLogout={true}
/>
```

## Next Steps

- Customize the UI to match your brand
- Add transaction history with `useTransactions`
- Implement your own payment flow
- Add error boundaries for better error handling
- Deploy to production with proper API keys

## Resources

- [Zaplink SDK Documentation](https://zaplink.filano.dev)
- [React Hooks Reference](../packages/react/README.md)
- [Core SDK API](../packages/core/README.md)

## Support

Need help? Contact us at support@piketplace.com
