export type MarketSnapshot = {
  indexName: string;
  currentValue: number;
  absoluteChange: number;
  percentageChange: number;
  asOf: string;
  sparkline: number[];
};

const nasdaqBase = {
  indexName: 'NASDAQ 100',
  currentValue: 18443.77,
  absoluteChange: 153.58,
  percentageChange: 0.84
};

const nasdaqSparklineSeed = [18105, 18180, 18235, 18310, 18285, 18360, 18410, 18445];

function withNoise(base: number, magnitude: number) {
  return Number((base + (Math.random() - 0.5) * magnitude).toFixed(2));
}

function buildSparkline(seed: number[]) {
  return seed.map((value) => withNoise(value, 35));
}

export async function fetchMarketSnapshot(): Promise<MarketSnapshot> {
  await new Promise((resolve) => setTimeout(resolve, 360));

  const currentValue = withNoise(nasdaqBase.currentValue, 32);
  const absoluteChange = withNoise(nasdaqBase.absoluteChange, 20);
  const percentageChange = Number(((absoluteChange / (currentValue - absoluteChange)) * 100).toFixed(2));

  return {
    indexName: nasdaqBase.indexName,
    currentValue,
    absoluteChange,
    percentageChange,
    asOf: new Date().toISOString(),
    sparkline: buildSparkline(nasdaqSparklineSeed)
  };
}
