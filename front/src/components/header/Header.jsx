"use client";
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

  // 로그인 상태 확인
  const checkLogin = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/auth/me");
      // console.log("로그인 사용자 정보: ", data);
      setUser(data); // 로그인 성공 -> 유저 정보 저장
    } catch (err) {
      // console.log("로그인 상태 확인 실패: ", err);
      sessionStorage.removeItem("accessToken");
      setUser(null); // 로그인 실패 -> 유저 정보 제거
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      sessionStorage.removeItem("accessToken");
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