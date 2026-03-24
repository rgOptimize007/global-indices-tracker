import styles from './ui.module.css';

export function Loader({ message }: { message: string }) {
  return (
    <div className={styles.loaderWrap}>
      <p className={styles.loaderText}>{message}</p>
      <div className={styles.loaderBar} aria-hidden="true" />
    </div>
  );
}
