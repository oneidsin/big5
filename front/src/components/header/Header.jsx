'use client';
import Link from 'next/link';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';

// 쿠키 읽기 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const isLoggedIn = getCookie('isLoggedIn');
    console.log('isLoggedIn 쿠키 값:', isLoggedIn);
    if (isLoggedIn) {
      try {
        const { data } = await api.get('/api/me');
        console.log('사용자 정보:', data);
        setUser(data); // 사용자 정보 저장
      } catch (err) {
        console.error('사용자 정보 가져오기 실패:', err.message);
        setUser(null);
      }
    } else {
      setUser(null); // 쿠키 없으면 로그아웃 상태
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await api.post('/api/logout');
        setUser(null);
        window.location.href = '/';
      } catch (err) {
        console.error('로그아웃 실패:', err.message);
      }
    }
  };

  return (
    <header>
      <nav className={styles.header}>
        <div>
          <Link href={'/'}>
            <img src='/big5.png' alt='logo' width={50} />
          </Link>
        </div>
        <ul className={styles.menu}>
          <li><Link href={'/'}>Home</Link></li>
          <li><Link href={'/testpage'}>Test</Link></li>
          <li><Link href={'/result'}>Result</Link></li>
        </ul>
        {loading ? null : user ? (
          <div className={styles.userContainer}>
            <span className={styles.username}>{user.name}님 환영합니다!</span>
            <Link href={'/profile'}>
              <button className={styles.profileBtn}>프로필</button>
            </Link>
            <button className={styles.btn} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <Link href={'/login'} className={styles.loginLink}>
            <button className={styles.btn}>로그인</button>
          </Link>
        )}
      </nav>
      <hr className={styles.fadedLine} />
    </header>
  );
}