import React from 'react';
import { ZaplinkProvider, useZaplink, PiLoginButton, UserProfile, usePayment } from '@zaplink/react';

// Your Zaplink configuration
const config = {
  apiKey: 'zap_501ff4000cc8d1d0e47becef74b777fbc4ff73ff73b336ff2553ef5873456dcd',
  secretKey: 'sk_b5dbd1cd8b0e5200752cb20e59f71f359fa712a55b4a99c076c1c290785107ee',
  appId: '5',
  environment: 'production' as const,
  debug: true,
};

function Dashboard() {
  const { user, isAuthenticated, isLoading, refreshUser } = useZaplink();
  const { createPayment, payment, isLoading: paymentLoading } = usePayment();

  const handlePayment = async () => {
    const amount = prompt('Enter amount in Pi:');
    if (amount) {
      const result = await createPayment(parseFloat(amount), 'Test payment from React example');
      if (result && result.payment_url) {
        window.open(result.payment_url, '_blank');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <h1>Zaplink SDK</h1>
            <p>React Example</p>
          </div>

          <PiLoginButton
            loginText="🔗 Login with Pi Network"
            loadingText="Connecting..."
            className="login-button"
          />

          <div className="info">
            <p>This is a demo application showcasing the Zaplink SDK for React.</p>
            <p>Click the button above to authenticate with Pi Network.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1>Welcome back!</h1>
          <p className="subtitle">Zaplink SDK React Demo</p>
        </div>
        <UserProfile
          showUsername={true}
          showBalance={true}
          showLogout={true}
          logoutText="Logout"
          className="user-profile-widget"
        />
      </div>

      <div className="content">
        {/* User Info Card */}
        <div className="card">
          <h2>👤 User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{user?.username || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Balance:</span>
              <span className="value">{user?.balance || 0} π</span>
            </div>
            <div className="info-item">
              <span className="label">Pi UID:</span>
              <span className="value mono">{user?.pi_uid || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Wallet:</span>
              <span className="value mono">
                {user?.wallet_address ? `${user.wallet_address.substring(0, 10)}...` : 'N/A'}
              </span>
            </div>
          </div>
          <button onClick={refreshUser} className="refresh-button">
            🔄 Refresh User Data
          </button>
        </div>

        {/* Payment Card */}
        <div className="card">
          <h2>💰 Create Payment</h2>
          <p className="card-description">
            Test the payment functionality by creating a Pi Network payment.
          </p>
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="payment-button"
          >
            {paymentLoading ? 'Creating Payment...' : '💳 Make a Payment'}
          </button>

          {payment && (
            <div className="payment-success">
              <p>✅ Payment created successfully!</p>
              <a href={payment.payment_url} target="_blank" rel="noopener noreferrer" className="payment-link">
                Open Payment Link →
              </a>
            </div>
          )}
        </div>

        {/* SDK Info Card */}
        <div className="card info-card">
          <h2>📦 SDK Features</h2>
          <ul className="feature-list">
            <li>✅ Easy Pi Network authentication</li>
            <li>✅ Secure HMAC-signed API requests</li>
            <li>✅ React hooks for state management</li>
            <li>✅ Pre-built UI components</li>
            <li>✅ TypeScript support</li>
            <li>✅ Session management</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <p>
          Built with ❤️ using <strong>@zaplink/react</strong>
        </p>
        <p className="footer-links">
          <a href="https://zaplink.filano.dev" target="_blank" rel="noopener noreferrer">
            Documentation
          </a>
          {' • '}
          <a href="https://github.com/filanodev/zaplink-sdk" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ZaplinkProvider
      {...config}
      onAuthSuccess={(user) => console.log('Auth success:', user)}
      onAuthError={(error) => console.error('Auth error:', error)}
      onLogout={() => console.log('User logged out')}
    >
      <Dashboard />
    </ZaplinkProvider>
  );
}
