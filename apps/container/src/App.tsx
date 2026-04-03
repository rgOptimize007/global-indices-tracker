import { lazy, Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingCard } from './components/LoadingCard';
import { RemoteCardShell } from './components/RemoteCardShell';

type Tick = { ts: string; value: number };
type Timeframe = '1D' | '1W' | '1M';
type IndexDataset = {
  symbol: string;
  name: string;
  currency: string;
  series: Record<Timeframe, Tick[]>;
};
type DataResponse = { generatedAt: string; timeframes: Timeframe[]; indices: IndexDataset[] };

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DataResponse };

const NiftyCard = lazy(() => import('mfe_nifty/MarketCard'));
const NasdaqCard = lazy(() => import('mfe_nasdaq/MarketCard'));

function buildChartPath(points: number[]): string {
  if (points.length < 2) {
    return 'M 0 100 L 100 100';
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / span) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function formatNumber(value: number, currency: string): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function getDelta(series: Tick[]): { absolute: number; percent: number } {
  if (series.length < 2) return { absolute: 0, percent: 0 };
  const first = series[0].value;
  const latest = series[series.length - 1].value;
  const absolute = latest - first;
  const percent = first === 0 ? 0 : (absolute / first) * 100;
  return { absolute, percent };
}

export default function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
  const [activeSymbol, setActiveSymbol] = useState('NIFTY50');

  useEffect(() => {
    if (state.status !== 'loading') {
      return;
    }

    fetch('/data/indices.json')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load index dataset.');
        }
        return (await response.json()) as DataResponse;
      })
      .then((data) => {
        setState({ status: 'success', data });
        if (data.timeframes.length > 0) {
          setActiveTimeframe(data.timeframes[0]);
        }
        if (data.indices.length > 0) {
          setActiveSymbol(data.indices[0].symbol);
        }
      })
      .catch((error: unknown) => {
        setState({ status: 'error', message: error instanceof Error ? error.message : 'Failed to load dataset.' });
      });
  }, [state.status]);

  if (state.status === 'loading') {
    return <div className="tv-shell"><p>Loading interactive market dataset…</p></div>;
  }

  if (state.status === 'error') {
    return <div className="tv-shell"><p>{state.message}</p></div>;
  }

  const selected = state.data.indices.find((item) => item.symbol === activeSymbol) ?? state.data.indices[0];
  const activeSeries = selected.series[activeTimeframe] ?? [];
  const chartPath = buildChartPath(activeSeries.map((point) => point.value));

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
          <h1>{selected.name}</h1>
          <p className="tv-dataset-meta">Data source: local SQLite test dataset • Updated {new Date(state.data.generatedAt).toLocaleString()}</p>
        </section>

        <section className="tv-indices-strip" aria-label="Major indices">
          {state.data.indices.map((item) => {
            const series = item.series[activeTimeframe] ?? [];
            const latest = series[series.length - 1]?.value ?? 0;
            const delta = getDelta(series);

            return (
              <button key={item.symbol} type="button" className={`tv-index-chip ${item.symbol === selected.symbol ? 'active' : ''}`} onClick={() => setActiveSymbol(item.symbol)}>
                <p>{item.name}</p>
                <div>
                  <span>{formatNumber(latest, item.currency)} {item.currency}</span>
                  <strong className={delta.percent >= 0 ? 'up' : 'down'}>{delta.percent >= 0 ? '+' : ''}{delta.percent.toFixed(2)}%</strong>
                </div>
              </button>
            );
          })}
        </section>

        <section className="tv-chart-panel" aria-label="Primary market chart panel">
          <header>
            <h2>{selected.name}</h2>
            <p>{selected.currency} · {activeTimeframe}</p>
          </header>
          <div className="tv-chart-wrap">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${selected.name} line chart`}>
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
            {state.data.timeframes.map((timeframe) => (
              <button key={timeframe} type="button" className={activeTimeframe === timeframe ? 'active' : ''} onClick={() => setActiveTimeframe(timeframe)}>
                {timeframe}
              </button>
            ))}
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
