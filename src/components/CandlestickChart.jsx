import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
} from 'lightweight-charts';
import './CandlestickChart.css';

function generateCandles(count = 80) {
  const candles = [];
  let price = 0.218;
  const baseTime = new Date('2026-03-31T00:00:00Z').getTime();

  for (let i = count; i >= 0; i--) {
    const timeMs = baseTime - i * 4 * 60 * 60 * 1000;
    const open = price;
    const change = (Math.random() - 0.48) * 0.015;
    const close = Math.max(0.01, open + change);
    const high = Math.max(open, close) + Math.random() * 0.008;
    const low = Math.min(open, close) - Math.random() * 0.008;
    const volume = 50000 + Math.random() * 200000;

    candles.push({
      time: Math.floor(timeMs / 1000),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(Math.max(0.005, low).toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume: Math.floor(volume),
    });
    price = close;
  }
  return candles;
}

const TIMEFRAMES = ['1H', '4H', '1D', '1W'];
const CANDLES = generateCandles(80);

export default function CandlestickChart({ market }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [activeTimeframe, setActiveTimeframe] = useState('4H');
  const [hoveredCandle, setHoveredCandle] = useState(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#7B8BA0',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(30, 42, 58, 0.6)', style: 1 },
        horzLines: { color: 'rgba(30, 42, 58, 0.6)', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(0, 131, 168, 0.5)',
          width: 1,
          style: 1,
          labelBackgroundColor: '#0083A8',
        },
        horzLine: {
          color: 'rgba(0, 131, 168, 0.5)',
          width: 1,
          style: 1,
          labelBackgroundColor: '#0083A8',
        },
      },
      rightPriceScale: {
        borderColor: '#1E2A3A',
        scaleMargins: { top: 0.1, bottom: 0.3 },
      },
      timeScale: {
        borderColor: '#1E2A3A',
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: { visible: false },
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
    });

    // v5 API: addSeries with series type
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00D9A5',
      downColor: '#FF4C6A',
      borderUpColor: '#00D9A5',
      borderDownColor: '#FF4C6A',
      wickUpColor: '#00D9A5',
      wickDownColor: '#FF4C6A',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 },
    });

    const volumeData = CANDLES.map(c => ({
      time: c.time,
      value: c.volume,
      color: c.close >= c.open
        ? 'rgba(0, 217, 165, 0.25)'
        : 'rgba(255, 76, 106, 0.25)',
    }));

    candleSeries.setData(CANDLES);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    chart.subscribeCrosshairMove(param => {
      if (param.seriesData) {
        const data = param.seriesData.get(candleSeries);
        if (data) setHoveredCandle(data);
      }
    });

    const ro = new ResizeObserver(() => {
      if (chartRef.current) {
        chart.applyOptions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight,
        });
      }
    });

    ro.observe(chartRef.current);
    chartInstanceRef.current = chart;
    candleSeriesRef.current = candleSeries;

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  const lastCandle = CANDLES[CANDLES.length - 1];
  const priceChange = lastCandle.close - lastCandle.open;
  const pctChange = (priceChange / lastCandle.open) * 100;
  const isUp = priceChange >= 0;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-market-info">
          <div className="chart-price-block">
            <span className={`chart-price mono ${isUp ? 'text-green' : 'text-red'}`}>
              ${(hoveredCandle?.close ?? lastCandle.close).toFixed(4)}
            </span>
            <span className={`chart-change ${isUp ? 'text-green' : 'text-red'}`}>
              {isUp ? '+' : ''}{pctChange.toFixed(2)}%
            </span>
          </div>
          {hoveredCandle && (
            <div className="chart-ohlc mono">
              <span>O: <b>{hoveredCandle.open?.toFixed(4)}</b></span>
              <span>H: <b className="text-green">{hoveredCandle.high?.toFixed(4)}</b></span>
              <span>L: <b className="text-red">{hoveredCandle.low?.toFixed(4)}</b></span>
              <span>C: <b>{hoveredCandle.close?.toFixed(4)}</b></span>
            </div>
          )}
        </div>
        <div className="chart-controls">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              className={`tf-btn ${activeTimeframe === tf ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartRef} className="chart-canvas" />
    </div>
  );
}
