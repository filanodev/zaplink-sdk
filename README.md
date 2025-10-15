# Zaplink SDK

> Easy Pi Network integration for JavaScript applications

[![npm version](https://img.shields.io/npm/v/@zaplink/core.svg)](https://www.npmjs.com/package/@zaplink/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Zaplink SDK makes it simple to integrate Pi Network authentication and payments into your JavaScript applications. Whether you're building with React, Vue, Next.js, Nuxt, or vanilla JavaScript, we've got you covered.

## 📦 Packages

- [`@zaplink/core`](./packages/core) - Core SDK for vanilla JavaScript
- [`@zaplink/react`](./packages/react) - React hooks and components
- [`@zaplink/vue`](./packages/vue) - Vue composables and components
- [`@zaplink/next`](./packages/next) - Next.js integration
- [`@zaplink/nuxt`](./packages/nuxt) - Nuxt module

## 🚀 Quick Start

### React

```bash
npm install @zaplink/react
```

```jsx
import { ZaplinkProvider, useZaplink } from '@zaplink/react';

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

function YourApp() {
  const { login, user, makePayment } = useZaplink();

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={() => makePayment(10)}>
            Pay 10 Pi
          </button>
        </div>
      ) : (
        <button onClick={login}>Login with Pi</button>
      )}
    </div>
  );
}
```

### Vue

```bash
npm install @zaplink/vue
```

```vue
<template>
  <div>
    <button v-if="!user" @click="login">Login with Pi</button>
    <div v-else>
      <p>Welcome, {{ user.username }}!</p>
      <button @click="makePayment(10)">Pay 10 Pi</button>
    </div>
  </div>
</template>

<script setup>
import { useZaplink } from '@zaplink/vue';

const { login, user, makePayment } = useZaplink({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  appId: 'your-app-id'
});
</script>
```

### Vanilla JavaScript

```bash
npm install @zaplink/core
```

```javascript
import Zaplink from '@zaplink/core';

const zaplink = new Zaplink({
  apiKey: 'your-api-key',
  secretKey: 'your-secret-key',
  appId: 'your-app-id'
});

// Login
await zaplink.login();

// Get user info
const user = zaplink.getUser();

// Make payment
await zaplink.makePayment(10, 'Payment for service');
```

## 🎯 Features

- ✅ **Easy Integration** - Get started in minutes
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Framework Agnostic** - Works with any JavaScript framework
- ✅ **Secure** - Built-in HMAC signature validation
- ✅ **Modern** - Built with latest JavaScript standards
- ✅ **Lightweight** - Minimal bundle size
- ✅ **Well Documented** - Comprehensive docs and examples

## 📖 Documentation

Visit [zaplink.filano.dev](https://zaplink.filano.dev) for full documentation.

## 🔧 Development

This is a pnpm workspace monorepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## 📄 License

MIT © Zaplink

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## 💬 Support

- 📧 Email: support@piketplace.com
- 🌐 Website: https://zaplink.filano.dev
- 📚 Docs: https://zaplink.filano.dev/documentation

## 🏆 Pi Hackathon 2025

This SDK was created for Pi Hackathon 2025 to make Pi Network integration accessible to all developers.

---

Made with ❤️ by the Zaplink team
