export type MarketSnapshot = {
  indexName: string;
  currentValue: number;
  absoluteChange: number;
  percentageChange: number;
  asOf: string;
};

const niftySnapshot: MarketSnapshot = {
  indexName: 'NIFTY 50',
  currentValue: 24982.15,
  absoluteChange: 292.2,
  percentageChange: 1.18,
  asOf: '2026-03-24T09:45:00+05:30'
};

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (Math.random() < 0.15) {
    throw new Error('NIFTY feed timeout. Please retry.');
  }

  return niftySnapshot;
}
