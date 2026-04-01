import { useState } from 'react';
import { Search, Filter, TrendingUp, Cloud, Vote, ChevronRight, Flame, Clock } from 'lucide-react';
import './MarketExplorer.css';

const CATEGORIES = [
  { id: 'all', label: 'All Markets', icon: <TrendingUp size={14}/>, count: 142 },
  { id: 'sports', label: 'Sports', icon: <span style={{fontSize:13}}>⚽</span>, count: 54 },
  { id: 'politics', label: 'Politics', icon: <Vote size={14}/>, count: 38 },
  { id: 'weather', label: 'Weather', icon: <Cloud size={14}/>, count: 21 },
  { id: 'crypto', label: 'Crypto', icon: <span style={{fontSize:13}}>₿</span>, count: 29 },
];

const MARKETS = [
  {
    id: 'm1', category: 'sports', title: 'Will Argentina win the 2026 FIFA World Cup?',
    volume: '842.5K', endDate: '15 Jul 2026', yesProb: 0.34,
    hot: true, trending: true,
  },
  {
    id: 'm2', category: 'politics', title: 'Will US Federal Reserve cut rates in Q2 2026?',
    volume: '1.2M', endDate: '30 Jun 2026', yesProb: 0.67,
    hot: true, trending: false,
  },
  {
    id: 'm3', category: 'weather', title: 'Will April 2026 global avg temp exceed 1.5°C above baseline?',
    volume: '321.0K', endDate: '30 Apr 2026', yesProb: 0.72,
    hot: false, trending: true,
  },
  {
    id: 'm4', category: 'crypto', title: 'Will ALGO reach $1.00 before July 2026?',
    volume: '2.1M', endDate: '1 Jul 2026', yesProb: 0.29,
    hot: true, trending: true,
  },
  {
    id: 'm5', category: 'sports', title: 'Will LeBron James retire by end of 2026?',
    volume: '498.2K', endDate: '31 Dec 2026', yesProb: 0.51,
    hot: false, trending: false,
  },
  {
    id: 'm6', category: 'politics', title: 'Will UK hold a general election before Dec 2026?',
    volume: '189.7K', endDate: '31 Dec 2026', yesProb: 0.44,
    hot: false, trending: false,
  },
  {
    id: 'm7', category: 'crypto', title: 'Will Ethereum ETF inflows exceed $5B in Q2 2026?',
    volume: '876.3K', endDate: '30 Jun 2026', yesProb: 0.58,
    hot: true, trending: false,
  },
  {
    id: 'm8', category: 'weather', title: 'Will a Category 5 hurricane hit the US in 2026?',
    volume: '412.1K', endDate: '30 Nov 2026', yesProb: 0.31,
    hot: false, trending: true,
  },
];

export default function MarketExplorer({ selectedMarket, onSelectMarket }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = MARKETS.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <aside className="market-explorer">
      <div className="explorer-header">
        <h2 className="explorer-title">Market Explorer</h2>
        <button className="icon-btn" title="Filter">
          <Filter size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <Search size={13} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search markets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="category-list">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
            <span className="cat-count">{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="explorer-divider" />

      {/* Markets List */}
      <div className="markets-list">
        <div className="markets-list-header">
          <span>Markets ({filtered.length})</span>
          <div className="sort-tabs">
            <button className="sort-tab active">Hot</button>
            <button className="sort-tab">New</button>
            <button className="sort-tab">Vol</button>
          </div>
        </div>

        {filtered.map(market => (
          <button
            key={market.id}
            className={`market-card ${selectedMarket?.id === market.id ? 'selected' : ''}`}
            onClick={() => onSelectMarket(market)}
          >
            <div className="market-card-top">
              <div className="market-badges">
                {market.hot && (
                  <span className="badge hot"><Flame size={9} /> Hot</span>
                )}
                {market.trending && (
                  <span className="badge trending"><TrendingUp size={9} /> Trending</span>
                )}
              </div>
              <ChevronRight size={12} className="market-arrow" />
            </div>
            <p className="market-card-title">{market.title}</p>
            <div className="market-card-footer">
              <div className="prob-bar-wrap">
                <div className="prob-bar">
                  <div
                    className="prob-fill yes"
                    style={{ width: `${market.yesProb * 100}%` }}
                  />
                </div>
                <span className="prob-label">
                  {(market.yesProb * 100).toFixed(0)}% YES
                </span>
              </div>
              <div className="market-meta">
                <span><Clock size={9} /> {market.endDate}</span>
                <span className="m-vol">Vol: ${market.volume}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
