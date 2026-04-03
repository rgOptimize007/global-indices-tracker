export type MarketSnapshot = {
  indexName: string;
  currentValue: number;
  absoluteChange: number;
  percentageChange: number;
  asOf: string;
  sparkline: number[];
};

const niftyBase = {
  indexName: 'NIFTY 50',
  currentValue: 24982.15,
  absoluteChange: 292.2,
  percentageChange: 1.18
};

const niftySparklineSeed = [24690, 24735, 24790, 24855, 24810, 24870, 24920, 24982];

function withNoise(base: number, magnitude: number) {
  return Number((base + (Math.random() - 0.5) * magnitude).toFixed(2));
}

function buildSparkline(seed: number[]) {
  return seed.map((value) => withNoise(value, 28));
}

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 380));

  const currentValue = withNoise(niftyBase.currentValue, 25);
  const absoluteChange = withNoise(niftyBase.absoluteChange, 18);
  const percentageChange = Number(((absoluteChange / (currentValue - absoluteChange)) * 100).toFixed(2));

  return {
    indexName: niftyBase.indexName,
    currentValue,
    absoluteChange,
    percentageChange,
    asOf: new Date().toISOString(),
    sparkline: buildSparkline(niftySparklineSeed)
  };
}
