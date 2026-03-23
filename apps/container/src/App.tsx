import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingCard } from './components/LoadingCard';
import { RemoteCardShell } from './components/RemoteCardShell';

const NiftyCard = lazy(() => import('mfe_nifty/MarketCard'));
const NasdaqCard = lazy(() => import('mfe_nasdaq/MarketCard'));

const shellMetrics = [
  { label: 'Regions covered', value: '2', detail: 'Composable dashboard tiles' },
  { label: 'Architecture', value: 'MFE', detail: 'Module Federation shell' },
  { label: 'Refresh model', value: 'Remote', detail: 'Each index owns its own data' }
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <div>
          <p className="eyebrow">Global Indices Tracker</p>
          <h1>Market overview dashboard</h1>
        </div>
        <nav aria-label="Primary">
          <ul className="nav-links">
            <li><a href="#overview">Overview</a></li>
            <li><a href="#indices">Indices</a></li>
            <li><a href="#about">About shell</a></li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-content">
        <section id="overview" className="hero-card">
          <div>
            <p className="eyebrow">Container app</p>
            <h2>Compose remote market widgets without owning their data pipelines.</h2>
            <p className="hero-copy">
              This host only provides shared layout, navigation, and resilient remote boundaries.
              Each market micro frontend remains responsible for its own index-specific content.
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

        <section id="indices" className="dashboard-grid" aria-label="Remote market dashboard">
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
        </section>

        <section id="about" className="info-banner">
          <h2>Shell responsibilities</h2>
          <p>
            The container orchestrates composition concerns like navigation, responsive layout, and remote lifecycle fallbacks.
            Market data retrieval and rendering logic stay inside each remote to preserve team autonomy.
          </p>
        </section>
      </main>
    </div>
  );
}
