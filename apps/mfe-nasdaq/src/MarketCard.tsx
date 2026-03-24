import { useEffect, useMemo, useState } from 'react';
import { fetchMarketSnapshot, type MarketSnapshot } from './marketData';

export type MarketCardProps = {
  sourceLabel?: string;
};

type AsyncState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: MarketSnapshot };

function currency(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function percent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export default function MarketCard({ sourceLabel = 'Remote · mfe-nasdaq' }: MarketCardProps) {
  const [state, setState] = useState<AsyncState>({ status: 'loading' });

  const load = async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetchMarketSnapshot();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Failed to load NASDAQ data.' });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const tone = useMemo(() => {
    if (state.status !== 'success') return '';
    return state.data.absoluteChange >= 0 ? 'is-positive' : 'is-negative';
  }, [state]);

  return (
    <article className={`market-card nasdaq-theme ${tone}`.trim()}>
      <p className="market-card__eyebrow">{sourceLabel}</p>

      {state.status === 'loading' && <p className="market-card__status">Loading NASDAQ quote…</p>}

      {state.status === 'error' && (
        <div className="market-card__status market-card__status--error" role="alert">
          <p>{state.message}</p>
          <button type="button" onClick={() => void load()}>Retry</button>
        </div>
      )}

      {state.status === 'success' && (
        <>
          <div className="market-card__headline">
            <h2>{state.data.indexName}</h2>
            <strong>{currency(state.data.currentValue)}</strong>
          </div>

          <dl className="market-card__stats">
            <div>
              <dt>Absolute change</dt>
              <dd>{state.data.absoluteChange >= 0 ? '+' : ''}{currency(state.data.absoluteChange)}</dd>
            </div>
            <div>
              <dt>Percentage change</dt>
              <dd>{percent(state.data.percentageChange)}</dd>
            </div>
          </dl>

          <p className="market-card__timestamp">As of {new Date(state.data.asOf).toLocaleString()}</p>
        </>
      )}
    </article>
  );
}
