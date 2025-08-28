import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <small>© {new Date().getFullYear()} Big5 — made by you</small>
      </div>
    </footer>
  );
}