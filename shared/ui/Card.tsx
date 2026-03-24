import type { PropsWithChildren } from 'react';
import styles from './ui.module.css';

type Tone = 'neutral' | 'positive' | 'negative';

export type CardProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  value?: string;
  tone?: Tone;
  footer?: string;
  showSparklinePlaceholder?: boolean;
}>;

export function Card({
  eyebrow,
  title,
  value,
  tone = 'neutral',
  footer,
  showSparklinePlaceholder = false,
  children
}: CardProps) {
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

      {showSparklinePlaceholder ? <div className={styles.sparklinePlaceholder}>Sparkline placeholder</div> : null}

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
