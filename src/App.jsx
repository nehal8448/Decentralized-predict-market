import { useState } from 'react';
import Header from './components/Header';
import MarketExplorer from './components/MarketExplorer';
import CandlestickChart from './components/CandlestickChart';
import MarketDetail from './components/MarketDetail';
import Orderbook from './components/Orderbook';
import TradePanel from './components/TradePanel';
import './App.css';

const DEFAULT_MARKET = {
  id: 'm4',
  category: 'crypto',
  title: 'Will ALGO reach $1.00 before July 2026?',
  volume: '2.1M',
  endDate: '1 Jul 2026',
  yesProb: 0.29,
  hot: true,
  trending: true,
};

export default function App() {
  const [selectedMarket, setSelectedMarket] = useState(DEFAULT_MARKET);

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        {/* Left: Market Explorer */}
        <div className="col-left">
          <MarketExplorer
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
          />
        </div>

        {/* Center: Chart + Detail */}
        <div className="col-center">
          <div className="center-chart">
            <CandlestickChart market={selectedMarket} />
          </div>
          <div className="center-detail">
            <MarketDetail market={selectedMarket} />
          </div>
        </div>

        {/* Right: Orderbook + Trade */}
        <div className="col-right">
          <div className="right-orderbook">
            <Orderbook market={selectedMarket} />
          </div>
          <div className="right-trade">
            <TradePanel market={selectedMarket} />
          </div>
        </div>
      </div>
    </div>
  );
}