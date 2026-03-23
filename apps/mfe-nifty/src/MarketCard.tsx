const movers = [
  { label: 'Top sector', value: 'Financial Services' },
  { label: 'Breadth', value: '31 advancers / 19 decliners' },
  { label: 'Volatility', value: 'Moderate' }
];

export default function MarketCard() {
  return (
    <article className="market-card nifty-theme">
      <header>
        <p className="market-card__eyebrow">Remote · mfe-nifty</p>
        <div className="market-card__headline">
          <div>
            <h2>NIFTY 50</h2>
            <p>Owned and rendered entirely by the Indian-market micro frontend.</p>
          </div>
          <strong>+1.18%</strong>
        </div>
      </header>

      <dl className="market-card__stats">
        <div>
          <dt>Last close</dt>
          <dd>24,982.15</dd>
        </div>
        <div>
          <dt>Day range</dt>
          <dd>24,701.40 – 25,021.90</dd>
        </div>
      </dl>

      <ul className="market-card__list">
        {movers.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}
