import type { PropsWithChildren } from 'react';
import styles from './ui.module.css';

type Tone = 'neutral' | 'positive' | 'negative';

export type CardProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  value?: string;
  tone?: Tone;
  footer?: string;
  sparklineData?: number[];
}>;

function Sparkline({ values, tone = 'neutral' }: { values: number[]; tone?: Tone }) {
  if (values.length < 2) {
    return <div className={styles.sparklinePlaceholder}>Waiting for market ticks…</div>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeClass = tone === 'positive' ? styles.sparklinePositive : tone === 'negative' ? styles.sparklineNegative : '';

  return (
    <div className={styles.sparklineWrap} aria-label="Mini trend chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.sparklineSvg} role="img">
        <polyline points={points} className={`${styles.sparklineLine} ${strokeClass}`.trim()} />
      </svg>
    </div>
  );
}

export function Card({ eyebrow, title, value, tone = 'neutral', footer, sparklineData = [], children }: CardProps) {
  const toneClass = tone === 'positive' ? styles.tonePositive : tone === 'negative' ? styles.toneNegative : '';

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{title}</h2>
          {value ? <strong className={`${styles.value} ${toneClass}`.trim()}>{value}</strong> : null}
        </div>
      </header>

      {children}

      <Sparkline values={sparklineData} tone={tone} />

      {footer ? <p className={styles.footer}>{footer}</p> : null}
    </article>
  );
}

export function CardGrid({ children }: PropsWithChildren) {
  return <div className={styles.grid}>{children}</div>;
}

export function CardGridItem({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: Tone }) {
  const toneClass = tone === 'positive' ? styles.tonePositive : tone === 'negative' ? styles.toneNegative : '';

  return (
    <div className={styles.gridItem}>
      <span className={styles.gridLabel}>{label}</span>
      <p className={`${styles.gridValue} ${toneClass}`.trim()}>{value}</p>
    </div>
  );
}
