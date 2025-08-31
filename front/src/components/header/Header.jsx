"use client";
import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  const [user, setUser] = useState(null);

  // 시작 시 로그인 상태 확인
  useEffect(() => {
    checkLogin();
  }, []);

  // 로그인 상태 확인
  const checkLogin = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) return; // 토큰이 없다면 로그인 안 된 상태

    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("로그인 사용자 정보: ", data);
      setUser(data); // 로그인 성공 -> 유저 정보 저장
    } catch (err) {
      console.log("로그인 상태 확인 실패: ", err);
      sessionStorage.removeItem("accessToken");
      setUser(null); // 로그인 실패 -> 유저 정보 제거
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/"; // 홈으로 이동
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

        {/* user 가 존재하면 로그아웃 버튼 렌더링, 아니면 로그인 버튼 렌더링 */}
        {user ? (
          <>
            <span className={styles.username}>{user.name}님 환영합니다!</span>
            <button className={styles.btn} onClick={handleLogout}>로그아웃</button>
          </>
        ) : <Link href={"/login"} style={{ marginLeft: 'auto' }}>
          <button className={styles.btn}>로그인</button>
        </Link>}
      </nav>
      <hr className={styles.fadedLine} />
    </header>
  );
}