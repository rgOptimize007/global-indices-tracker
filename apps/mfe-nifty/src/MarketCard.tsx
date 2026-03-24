import { useEffect, useState } from 'react';
import { Card, CardGrid, CardGridItem, ErrorState, Loader } from '../../../shared/ui';
import { fetchMarketSnapshot, type MarketSnapshot } from './marketData';

export type MarketCardProps = {
  sourceLabel?: string;
};

type AsyncState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: MarketSnapshot };

function currency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function percent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export default function MarketCard({ sourceLabel = 'Remote · mfe-nifty' }: MarketCardProps) {
  const [state, setState] = useState<AsyncState>({ status: 'loading' });

  const load = async () => {
    setState({ status: 'loading' });
    try {
      const data = await fetchMarketSnapshot();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Failed to load NIFTY data.' });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (state.status === 'loading') {
    return (
      <Card eyebrow={sourceLabel} title="NIFTY 50">
        <Loader message="Loading NIFTY quote…" />
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card eyebrow={sourceLabel} title="NIFTY 50">
        <ErrorState message={state.message} onRetry={() => void load()} />
      </Card>
    );
  }

  const tone = state.data.absoluteChange >= 0 ? 'positive' : 'negative';

  return (
    <Card
      eyebrow={sourceLabel}
      title={state.data.indexName}
      value={currency(state.data.currentValue)}
      tone={tone}
      showSparklinePlaceholder
      footer={`As of ${new Date(state.data.asOf).toLocaleString()}`}
    >
      <CardGrid>
        <CardGridItem
          label="Absolute change"
          value={`${state.data.absoluteChange >= 0 ? '+' : ''}${currency(state.data.absoluteChange)}`}
          tone={tone}
        />
        <CardGridItem label="Percentage change" value={percent(state.data.percentageChange)} tone={tone} />
      </CardGrid>
    </Card>
  );
}
