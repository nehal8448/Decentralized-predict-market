import { useState, useEffect } from 'react';
import './Orderbook.css';

function generateOrders(side, count = 8) {
  const orders = [];
  let price = side === 'asks' ? 0.344 : 0.340;
  const dir = side === 'asks' ? 1 : -1;

  for (let i = 0; i < count; i++) {
    const size = (500 + Math.random() * 5000).toFixed(0);
    const total = (price * parseFloat(size)).toFixed(2);
    orders.push({ price: price.toFixed(4), size, total });
    price += dir * (0.0003 + Math.random() * 0.0005);
  }
  return orders;
}

export default function Orderbook() {
  const [asks, setAsks] = useState(() => generateOrders('asks', 8));
  const [bids, setBids] = useState(() => generateOrders('bids', 8));
  const [flash, setFlash] = useState({});

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * 8);
      const side = Math.random() > 0.5 ? 'asks' : 'bids';
      const key = `${side}-${idx}`;

      setFlash(f => ({ ...f, [key]: side }));
      setTimeout(() => setFlash(f => { const copy = { ...f }; delete copy[key]; return copy; }), 600);

      if (side === 'asks') {
        setAsks(prev => {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], size: (500 + Math.random() * 5000).toFixed(0) };
          return copy;
        });
      } else {
        setBids(prev => {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], size: (500 + Math.random() * 5000).toFixed(0) };
          return copy;
        });
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const spread = (parseFloat(asks[0]?.price) - parseFloat(bids[0]?.price)).toFixed(4);
  const maxSize = Math.max(
    ...asks.map(a => parseFloat(a.size)),
    ...bids.map(b => parseFloat(b.size))
  );

  return (
    <div className="orderbook">
      <div className="orderbook-header">
        <h3 className="orderbook-title">Order Book</h3>
        <div className="ob-pair mono">YES/ALGO</div>
      </div>

      <div className="ob-col-labels">
        <span>Price (ALGO)</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      {/* Asks (sells) - reversed so lowest ask is nearest the spread */}
      <div className="ob-asks">
        {[...asks].reverse().map((ask, i) => {
          const key = `asks-${asks.length - 1 - i}`;
          return (
            <div
              key={i}
              className={`ob-row ask ${flash[key] === 'asks' ? 'flash-red' : ''}`}
            >
              <div
                className="ob-depth-bar ask"
                style={{ width: `${(parseFloat(ask.size) / maxSize) * 100}%` }}
              />
              <span className="ob-price text-red mono">{ask.price}</span>
              <span className="ob-size mono">{parseFloat(ask.size).toLocaleString()}</span>
              <span className="ob-total mono text-muted">{parseFloat(ask.total).toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Spread */}
      <div className="ob-spread">
        <span className="spread-mid mono">{asks[0]?.price}</span>
        <span className="spread-label">Spread: {spread}</span>
      </div>

      {/* Bids (buys) */}
      <div className="ob-bids">
        {bids.map((bid, i) => {
          const key = `bids-${i}`;
          return (
            <div
              key={i}
              className={`ob-row bid ${flash[key] === 'bids' ? 'flash-green' : ''}`}
            >
              <div
                className="ob-depth-bar bid"
                style={{ width: `${(parseFloat(bid.size) / maxSize) * 100}%` }}
              />
              <span className="ob-price text-green mono">{bid.price}</span>
              <span className="ob-size mono">{parseFloat(bid.size).toLocaleString()}</span>
              <span className="ob-total mono text-muted">{parseFloat(bid.total).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
