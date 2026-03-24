import styles from './ui.module.css';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className={styles.errorWrap} role="alert">
      <p className={styles.errorMessage}>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className={styles.retryButton}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
