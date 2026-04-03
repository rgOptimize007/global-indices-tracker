import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingCard } from './components/LoadingCard';
import { RemoteCardShell } from './components/RemoteCardShell';

const NiftyCard = lazy(() => import('mfe_nifty/MarketCard'));
const NasdaqCard = lazy(() => import('mfe_nasdaq/MarketCard'));

const shellMetrics = [
  { label: 'Live panes', value: '2', detail: 'Independent MFEs' },
  { label: 'Data source', value: 'Mock', detail: 'Remote-owned fetchers' },
  { label: 'Refresh', value: '12s', detail: 'Per-panel updates' }
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <div>
          <p className="eyebrow">Global Indices Tracker</p>
          <h1>Macro + Equities Control Center</h1>
        </div>
        <div className="status-pill">System online</div>
      </header>

      <main className="dashboard-content">
        <section id="overview" className="hero-card">
          <div>
            <p className="eyebrow">Container orchestration</p>
            <h2>Crypto-terminal inspired dashboard for global indices.</h2>
            <p className="hero-copy">
              The host handles composition and resilience. Every market tile runs in its own micro frontend,
              fetches its own data, and can deploy independently.
            </p>
          </div>
          <div className="metrics-grid" aria-label="Shell metrics">
            {shellMetrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="tv-indices-strip" aria-label="Major indices">
          {majorIndices.map((item) => (
            <article key={item.symbol} className="tv-index-chip">
              <p>{item.symbol}</p>
              <div>
                <span>{item.value}</span>
                <strong className={item.tone === 'up' ? 'up' : 'down'}>{item.change}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="tv-chart-panel" aria-label="Primary market chart panel">
          <header>
            <h2>Nifty 50 Index</h2>
            <p>INR · Intraday</p>
          </header>
          <div className="tv-chart-wrap">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Nifty intraday line chart">
              <defs>
                <linearGradient id="tv-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0, 191, 166, 0.4)" />
                  <stop offset="100%" stopColor="rgba(0, 191, 166, 0.02)" />
                </linearGradient>
              </defs>
              <path d={`${chartPath} L 100 100 L 0 100 Z`} fill="url(#tv-fill)" />
              <path d={chartPath} className="tv-line" />
            </svg>
          </div>
          <div className="tv-timeframes">
            <button type="button" className="active">1D</button>
            <button type="button">1M</button>
            <button type="button">3M</button>
            <button type="button">1Y</button>
            <button type="button">5Y</button>
            <button type="button">All</button>
          </div>
        </section>

        <section id="about" className="info-banner">
          <h2>Modular by design</h2>
          <p>
            Add new regions as independent remotes without changing the core shell architecture.
            The container remains focused on layout, while each remote owns market logic and rendering.
          </p>
        </section>
      </main>
    </div>
  );
}
