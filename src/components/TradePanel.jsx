import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Info, Zap, AlertTriangle } from 'lucide-react';
import './TradePanel.css';

const ALGO_PRICE_USD = 0.2184;

export default function TradePanel({ market }) {
  const [side, setSide] = useState('YES');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [submitted, setSubmitted] = useState(false);

  const yesPrice = market ? market.yesProb : 0.342;
  const noPrice = market ? (1 - market.yesProb) : 0.658;
  const currentPrice = side === 'YES' ? yesPrice : noPrice;

  const algoAmount = parseFloat(amount) || 0;
  const shares = algoAmount > 0 ? (algoAmount / currentPrice).toFixed(2) : '—';
  const potentialProfit = algoAmount > 0 ? (algoAmount / currentPrice - algoAmount).toFixed(2) : '—';
  const usdValue = (algoAmount * ALGO_PRICE_USD).toFixed(2);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setAmount('');
  };

  const presets = ['50', '100', '250', '500'];

  return (
    <div className="trade-panel">
      <div className="trade-panel-header">
        <h3 className="trade-title">Trade</h3>
        <div className="trade-pair mono">
          {side}/{(side === 'YES' ? 'NO' : 'YES')}
        </div>
      </div>

      {/* YES / NO Toggle */}
      <div className="side-toggle">
        <button
          className={`side-btn yes ${side === 'YES' ? 'active' : ''}`}
          onClick={() => setSide('YES')}
        >
          <ArrowUpCircle size={14} />
          YES
          <span className="side-price">{(yesPrice * 100).toFixed(1)}¢</span>
        </button>
        <button
          className={`side-btn no ${side === 'NO' ? 'active' : ''}`}
          onClick={() => setSide('NO')}
        >
          <ArrowDownCircle size={14} />
          NO
          <span className="side-price">{(noPrice * 100).toFixed(1)}¢</span>
        </button>
      </div>

      {/* Order Type */}
      <div className="order-type-tabs">
        {['market', 'limit'].map(t => (
          <button
            key={t}
            className={`order-type-tab ${orderType === t ? 'active' : ''}`}
            onClick={() => setOrderType(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="trade-form">
        {orderType === 'limit' && (
          <div className="form-group">
            <label className="form-label">
              Limit Price (ALGO)
              <span className="form-hint">Current: {currentPrice.toFixed(4)}</span>
            </label>
            <div className="input-wrapper">
              <input
                type="number"
                className="form-input"
                placeholder="0.0000"
                value={limitPrice}
                onChange={e => setLimitPrice(e.target.value)}
              />
              <span className="input-suffix">ALGO</span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            Amount
            <span className="form-hint">≈ ${usdValue} USD</span>
          </label>
          <div className="input-wrapper">
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={amount}
              min="0"
              onChange={e => setAmount(e.target.value)}
            />
            <span className="input-suffix">ALGO</span>
          </div>
          <div className="preset-btns">
            {presets.map(p => (
              <button key={p} className="preset-btn" onClick={() => setAmount(p)}>
                {p}
              </button>
            ))}
            <button className="preset-btn max" onClick={() => setAmount('1284.50')}>
              MAX
            </button>
          </div>
        </div>

        {/* Slippage */}
        <div className="form-group">
          <label className="form-label">
            Slippage Tolerance
            <span className="form-hint">Max price impact</span>
          </label>
          <div className="slippage-row">
            {['0.1', '0.5', '1.0', '2.0'].map(s => (
              <button
                key={s}
                className={`slippage-btn ${slippage === s ? 'active' : ''}`}
                onClick={() => setSlippage(s)}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="trade-summary">
          <div className="summary-row">
            <span>Avg. Price</span>
            <span className="mono">{currentPrice.toFixed(4)} ALGO</span>
          </div>
          <div className="summary-row">
            <span>Shares</span>
            <span className="mono">{shares}</span>
          </div>
          <div className="summary-row">
            <span>Potential Profit</span>
            <span className={`mono ${potentialProfit !== '—' && parseFloat(potentialProfit) > 0 ? 'text-green' : ''}`}>
              {potentialProfit !== '—' ? `+${potentialProfit} ALGO` : '—'}
            </span>
          </div>
          <div className="summary-row">
            <span>Protocol Fee</span>
            <span className="mono text-muted">0.3%</span>
          </div>
        </div>

        {/* Warning */}
        {algoAmount > 500 && (
          <div className="trade-warning">
            <AlertTriangle size={12} />
            <span>Large order may impact market price significantly.</span>
          </div>
        )}

        {/* Submit */}
        <button
          className={`trade-submit ${side === 'YES' ? 'yes' : 'no'} ${submitted ? 'success' : ''} ${!amount ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!amount}
        >
          {submitted ? (
            <>
              <Zap size={15} />
              <span>Order Submitted!</span>
            </>
          ) : (
            <>
              {side === 'YES'
                ? <ArrowUpCircle size={15} />
                : <ArrowDownCircle size={15} />
              }
              <span>Buy {side} {amount ? `· ${amount} ALGO` : ''}</span>
            </>
          )}
        </button>

        <p className="trade-disclaimer">
          <Info size={10} />
          Trades settled on Algorand mainnet via ARC-200 smart contracts
        </p>
      </div>
    </div>
  );
}
