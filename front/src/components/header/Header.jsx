import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header>
      <nav className={styles.header}>
        <div>
          <Link href={"/"}>
            <img src="/big5.png" alt="logo" width={50} />
          </Link>
        </div>

        <ul className={styles.menu}>
          <li><Link href={"/"}>Home</Link></li>
          <li><Link href={"/test"}>Test</Link></li>
          <li><Link href={"/result"}>Result</Link></li>
        </ul>

        <Link href={"/login"} style={{ marginLeft: 'auto' }}>
          <button className={styles.btn}>로그인</button>
        </Link>
      </nav>
      <hr className={styles.fadedLine} />
    </header>
  );
} ``