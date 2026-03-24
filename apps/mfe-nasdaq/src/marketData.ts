export type MarketSnapshot = {
  indexName: string;
  currentValue: number;
  absoluteChange: number;
  percentageChange: number;
  asOf: string;
};

const nasdaqSnapshot: MarketSnapshot = {
  indexName: 'NASDAQ Composite',
  currentValue: 18443.77,
  absoluteChange: 153.58,
  percentageChange: 0.84,
  asOf: '2026-03-24T16:05:00-04:00'
};

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 650));

  if (Math.random() < 0.15) {
    throw new Error('NASDAQ quote service is unavailable.');
  }

  return nasdaqSnapshot;
}
