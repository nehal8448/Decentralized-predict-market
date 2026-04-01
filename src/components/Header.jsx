import { useState } from 'react';
import { Zap, ChevronDown } from 'lucide-react';
import './Header.css';

const PeraLogo = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#FFEE55"/>
    <path d="M8 22L13 10L18 17L22 13L26 22" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlgoLogo = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="#0083A8" opacity="0.2" stroke="#0083A8" strokeWidth="2"/>
    <path d="M35 68L50 20L65 68M42 52H58" stroke="#00B4D8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TICKER_ITEMS = [
  { symbol: 'ALGO/USDT', price: '0.2184', change: '+3.42%', up: true },
  { symbol: 'BTC/USDT', price: '94,231.5', change: '+1.18%', up: true },
  { symbol: 'ETH/USDT', price: '3,412.8', change: '-0.87%', up: false },
  { symbol: 'SOL/USDT', price: '182.45', change: '+5.21%', up: true },
  { symbol: 'USDC/USDT', price: '1.0001', change: '+0.01%', up: true },
  { symbol: 'AVAX/USDT', price: '38.72', change: '-2.14%', up: false },
];

export default function Header() {
  const [connected, setConnected] = useState(false);

  return (
    <header className="header">
      <div className="header-main">
        {/* Logo */}
        <div className="header-logo">
          <AlgoLogo />
          <div className="logo-text">
            <span className="logo-name">AlgoPredict</span>
            <span className="logo-badge">BETA</span>
          </div>
          <div className="logo-divider" />
          <span className="logo-sub">Decentralized Prediction Market</span>
        </div>

        {/* Nav Links */}
        <nav className="header-nav">
          <a href="#" className="nav-link active">Markets</a>
          <a href="#" className="nav-link">Portfolio</a>
          <a href="#" className="nav-link">
            Governance <ChevronDown size={12} />
          </a>
          <a href="#" className="nav-link">Analytics</a>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <div className="network-badge">
            <span className="network-dot" />
            Algorand Mainnet
          </div>

          <button
            className={`connect-btn ${connected ? 'connected' : ''}`}
            onClick={() => setConnected(!connected)}
          >
            <PeraLogo />
            {connected ? (
              <span>7XKQ...D9M2</span>
            ) : (
              <span>Connect Pera Wallet</span>
            )}
            {connected && <ChevronDown size={12} />}
          </button>

          {connected && (
            <div className="wallet-balance">
              <Zap size={12} style={{ color: 'var(--algo-teal)' }} />
              <span className="mono">1,284.50</span>
              <span className="text-muted">ALGO</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Ticker */}
      <div className="ticker-bar">
        <div className="ticker-label">LIVE</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-symbol">{item.symbol}</span>
                <span className="ticker-price mono">${item.price}</span>
                <span className={`ticker-change ${item.up ? 'up' : 'down'}`}>
                  {item.change}
                </span>
                <span className="ticker-sep">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
