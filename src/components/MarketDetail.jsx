import { useState } from 'react';
import { Info, Users, TrendingUp, DollarSign, Calendar, Globe } from 'lucide-react';
import './MarketDetail.css';

export default function MarketDetail({ market }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!market) return (
    <div className="market-detail-empty">
      <div className="empty-icon">📊</div>
      <p>Select a market from the explorer to view details</p>
    </div>
  );

  const yesProb = market.yesProb;
  const noProb = 1 - yesProb;

  const stats = [
    { label: 'Total Volume', value: `$${market.volume} ALGO`, icon: <DollarSign size={13}/> },
    { label: 'Traders', value: '2,847', icon: <Users size={13}/> },
    { label: 'Ends', value: market.endDate, icon: <Calendar size={13}/> },
    { label: 'Resolution Source', value: 'Chainlink Oracle', icon: <Globe size={13}/> },
  ];

  return (
    <div className="market-detail">
      {/* Tabs */}
      <div className="detail-tabs">
        {['overview', 'activity', 'resolution'].map(tab => (
          <button
            key={tab}
            className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="detail-content">
          {/* Question */}
          <div className="detail-question">
            <div className="question-badge">
              <Info size={11} />
              <span>PREDICTION MARKET</span>
            </div>
            <h1 className="question-title">{market.title}</h1>
          </div>

          {/* Probability Gauge */}
          <div className="prob-gauge-card">
            <div className="prob-gauge-header">
              <div className="prob-side yes">
                <span className="prob-pct">{(yesProb * 100).toFixed(1)}%</span>
                <span className="prob-label">YES</span>
              </div>
              <div className="prob-gauge-bar">
                <div
                  className="prob-gauge-fill yes"
                  style={{ width: `${yesProb * 100}%` }}
                />
              </div>
              <div className="prob-side no">
                <span className="prob-pct">{(noProb * 100).toFixed(1)}%</span>
                <span className="prob-label">NO</span>
              </div>
            </div>
            <p className="prob-gauge-sub">Implied probability based on order book</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="detail-description">
            <h3>Market Description</h3>
            <p>
              This market resolves YES if the stated condition is fulfilled based on official
              verified data sources. All settlements are handled on-chain via smart contracts
              deployed on the Algorand blockchain. Resolution data is sourced from Chainlink
              oracle networks to ensure trustless, transparent outcomes.
            </p>
            <p>
              Trading is facilitated in ALGO tokens. Your positions are recorded as ASA tokens
              (YES/NO shares) that can be claimed post-resolution.
            </p>
          </div>

          {/* Rules */}
          <div className="rules-card">
            <h4><TrendingUp size={13} /> Resolution Rules</h4>
            <ul>
              <li>Market resolves based on official data as of the end date.</li>
              <li>If the event is inconclusive, all positions are refunded.</li>
              <li>Contradictory evidence triggers a 72-hour Kleros arbitration period.</li>
              <li>Liquidity providers receive 0.3% of all trades as protocol fees.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="detail-content">
          <ActivityFeed />
        </div>
      )}

      {activeTab === 'resolution' && (
        <div className="detail-content">
          <ResolutionInfo market={market} />
        </div>
      )}
    </div>
  );
}

const ACTIVITY = [
  { user: '7XKQ...D9M2', action: 'Bought YES', amount: '500', price: '0.342', time: '2m ago', up: true },
  { user: 'ALGO...8F4A', action: 'Bought NO', amount: '1,200', price: '0.658', time: '5m ago', up: false },
  { user: 'PERA...2C7B', action: 'Bought YES', amount: '250', price: '0.341', time: '8m ago', up: true },
  { user: 'MNGO...9D1F', action: 'Added Liquidity', amount: '2,000', price: '--', time: '12m ago', up: true },
  { user: '3K9X...L0P2', action: 'Bought NO', amount: '800', price: '0.659', time: '18m ago', up: false },
  { user: 'AX1Z...Q7R5', action: 'Bought YES', amount: '350', price: '0.340', time: '24m ago', up: true },
];

function ActivityFeed() {
  return (
    <div className="activity-feed">
      <h3>Recent Trades</h3>
      <div className="activity-list">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="activity-row">
            <div className="activity-col user mono">{a.user}</div>
            <div className={`activity-col action ${a.up ? 'text-green' : 'text-red'}`}>{a.action}</div>
            <div className="activity-col amount mono">{a.amount} ALGO</div>
            <div className="activity-col price mono">${a.price}</div>
            <div className="activity-col time text-muted">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResolutionInfo({ market }) {
  return (
    <div className="resolution-info">
      <div className="resolution-status">
        <div className="status-indicator pending">
          <span className="status-dot" />
          <span>Awaiting Resolution</span>
        </div>
        <p>Market resolves on <strong>{market.endDate}</strong></p>
      </div>
      <div className="oracle-card">
        <h4>Oracle Configuration</h4>
        <div className="oracle-row">
          <span>Provider</span><span className="mono">Chainlink OCR v2</span>
        </div>
        <div className="oracle-row">
          <span>Data Feed</span><span className="mono">0x4F9...A12C</span>
        </div>
        <div className="oracle-row">
          <span>Aggregation</span><span className="mono">Median of 7 nodes</span>
        </div>
        <div className="oracle-row">
          <span>Dispute Window</span><span className="mono">72 hours</span>
        </div>
      </div>
    </div>
  );
}
