import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingCard } from './components/LoadingCard';
import { RemoteCardShell } from './components/RemoteCardShell';

const NiftyCard = lazy(() => import('mfe_nifty/MarketCard'));
const NasdaqCard = lazy(() => import('mfe_nasdaq/MarketCard'));

const majorIndices = [
  { symbol: 'NIFTY 50', value: '22,713.10', change: '+0.15%', tone: 'up' },
  { symbol: 'SENSEX', value: '73,319.55', change: '+0.25%', tone: 'up' },
  { symbol: 'NIFTY MIDCAP', value: '12,394.55', change: '-0.53%', tone: 'down' },
  { symbol: 'NIFTY 500', value: '20,938.35', change: '+0.02%', tone: 'up' },
  { symbol: 'MIDCAP 100', value: '53,677.05', change: '-0.26%', tone: 'down' }
] as const;

const chartPoints = [12, 14, 13, 15, 13, 14, 16, 15, 18, 17, 20, 22, 21, 23, 25, 24, 28, 27, 29, 31, 30, 33, 32, 34];
const chartPath = chartPoints
  .map((point, index) => {
    const x = (index / (chartPoints.length - 1)) * 100;
    const y = 100 - ((point - 12) / (34 - 12)) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  })
  .join(' ');

export default function App() {
  return (
    <div className="tv-shell">
      <header className="tv-topbar">
        <div className="tv-brand">TV Global Indices</div>
        <div className="tv-search">Search (Ctrl+K)</div>
        <nav className="tv-links" aria-label="Primary">
          <a href="#">Markets</a>
          <a href="#">Community</a>
          <a href="#">Products</a>
        </nav>
        <button type="button" className="tv-upgrade">Upgrade</button>
      </header>

      <main className="tv-content">
        <section className="tv-hero">
          <p className="tv-breadcrumb">markets / global / indices</p>
          <h1>India Major indices</h1>
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

        <section className="tv-remotes">
          <h2>Live MFE panels</h2>
          <div className="dashboard-grid" aria-label="Remote market dashboard">
            <ErrorBoundary title="NIFTY widget unavailable" description="The mfe-nifty remote could not be loaded right now.">
              <Suspense fallback={<LoadingCard title="Loading NIFTY widget" description="Connecting to the mfe-nifty remote." />}>
                <RemoteCardShell>
                  <NiftyCard />
                </RemoteCardShell>
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary title="NASDAQ widget unavailable" description="The mfe-nasdaq remote could not be loaded right now.">
              <Suspense fallback={<LoadingCard title="Loading NASDAQ widget" description="Connecting to the mfe-nasdaq remote." />}>
                <RemoteCardShell>
                  <NasdaqCard />
                </RemoteCardShell>
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </main>
    </div>
  );
}
