# Zaplink SDK - Quick Start Guide

Get started with Zaplink SDK in under 5 minutes!

## 📦 Installation

Choose your framework:

```bash
# React
npm install @zaplink/react

# Vue (coming soon)
npm install @zaplink/vue

# Next.js (coming soon)
npm install @zaplink/next

# Vanilla JavaScript
npm install @zaplink/core
```

## 🚀 Quick Setup

### React

**Step 1:** Wrap your app with `ZaplinkProvider`

```jsx
import { ZaplinkProvider } from '@zaplink/react';

function App() {
  return (
    <ZaplinkProvider
      apiKey="your-api-key"
      secretKey="your-secret-key"
      appId="your-app-id"
    >
      <YourApp />
    </ZaplinkProvider>
  );
}
```

**Step 2:** Use the `useZaplink` hook

```jsx
import { useZaplink, PiLoginButton } from '@zaplink/react';

function YourApp() {
  const { user, isAuthenticated, makePayment } = useZaplink();

  if (!isAuthenticated) {
    return <PiLoginButton />;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Balance: {user.balance} π</p>
      <button onClick={() => makePayment(10)}>Pay 10 Pi</button>
    </div>
  );
}
```

**That's it!** You now have Pi Network integration working.

### Vanilla JavaScript

```javascript
import Zaplink from '@zaplink/core';

const zaplink = new Zaplink({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  appId: 'your-app-id'
});

// Login
await zaplink.login();

// Get user
const user = zaplink.getUser();

// Make payment
await zaplink.makePayment(10, 'Payment for service');
```

## 🔑 Getting Your API Keys

1. Go to [Zaplink Developer Portal](https://app.zaplink.filano.dev)
2. Create a new application
3. Copy your API key and secret key
4. Use them in your app configuration

## 📚 Next Steps

- **Read the full docs**: [zaplink.filano.dev](https://zaplink.filano.dev)
- **View examples**: Check the `/examples` folder
- **Join the community**: support@piketplace.com

## ⚡ Common Use Cases

### Making a payment

```jsx
const { makePayment } = useZaplink();

const handlePurchase = async () => {
  const payment = await makePayment(50, 'Premium subscription');
  window.location.href = payment.payment_url;
};
```

### Getting user balance

```jsx
const { user, refreshUser } = useZaplink();

const updateBalance = async () => {
  await refreshUser();
  console.log('New balance:', user.balance);
};
```

### Listening to events

```jsx
<ZaplinkProvider
  {...config}
  onAuthSuccess={(user) => console.log('Logged in:', user)}
  onAuthError={(error) => console.error('Error:', error)}
>
  <App />
</ZaplinkProvider>
```

## 🎨 Pre-built Components

```jsx
import {
  PiLoginButton,
  UserBalance,
  UserProfile
} from '@zaplink/react';

// Login button
<PiLoginButton loginText="Connect with Pi" />

// Display balance
<UserBalance showSymbol={true} decimals={2} />

// User profile widget
<UserProfile
  showUsername={true}
  showBalance={true}
  showLogout={true}
/>
```

## 💡 Tips

1. **Enable debug mode** during development:
   ```jsx
   <ZaplinkProvider debug={true} {...config}>
   ```

2. **Handle authentication callbacks** automatically - the SDK does this for you!

3. **Check authentication status**:
   ```jsx
   const { isAuthenticated, isLoading } = useZaplink();
   ```

4. **Use TypeScript** for better developer experience - all types are included!

## ❓ Need Help?

- 📧 Email: support@piketplace.com
- 🌐 Website: https://zaplink.filano.dev
- 📚 Full Docs: https://zaplink.filano.dev/documentation
- 🐛 Issues: https://github.com/filanodev/zaplink-sdk/issues

---

Happy coding with Zaplink SDK! 🚀
