const highlights = [
  { label: 'Top contributor', value: 'Semiconductors' },
  { label: 'Market breadth', value: '58 advancers / 42 decliners' },
  { label: 'Momentum', value: 'Risk-on' }
];

export default function MarketCard() {
  return (
    <article className="market-card nasdaq-theme">
      <header>
        <p className="market-card__eyebrow">Remote · mfe-nasdaq</p>
        <div className="market-card__headline">
          <div>
            <h2>NASDAQ Composite</h2>
            <p>Delivered by the US-market micro frontend with its own presentation and sourcing.</p>
          </div>
          <strong>+0.84%</strong>
        </div>
      </header>

      <dl className="market-card__stats">
        <div>
          <dt>Last close</dt>
          <dd>18,443.77</dd>
        </div>
        <div>
          <dt>Day range</dt>
          <dd>18,201.13 – 18,497.52</dd>
        </div>
      </dl>

      <ul className="market-card__list">
        {highlights.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}
