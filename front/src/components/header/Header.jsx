'use client';
import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 시작 시 로그인 상태 확인
  useEffect(() => {
    checkLogin();
  }, []);

  // 로그인 상태 확인: 쿠키를 통해 서버에 사용자 정보 요청
  const checkLogin = async () => {
    try {
      const { data } = await api.get("/api/me");
      setUser(data); // 로그인 성공 -> 유저 정보 저장
    } catch (err) {
      // 쿠키가 없거나 유효하지 않으면 401 에러가 발생하고, axios 인터셉터가 처리함.
      // 여기서는 사용자 상태를 null로 설정합니다.
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 현재는 로그아웃 API가 없으므로 클라이언트 상태만 초기화합니다.
      // TODO: 추후 백엔드에 로그아웃 API를 구현하고 호출해야 합니다.
      setUser(null);
      window.location.href = "/"; // 홈으로 이동
    }
  }

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

        {loading ? null : user ? (
          <div className={styles.userContainer}>
            <span className={styles.username}>{user.name}님 환영합니다!</span>
            <button className={styles.btn} onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <Link href={"/login"} className={styles.loginLink}>
            <button className={styles.btn}>로그인</button>
          </Link>
        )}
      </nav>
      <hr className={styles.fadedLine} />
    </header>
  );
}
