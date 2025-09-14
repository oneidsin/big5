'use client';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import styles from './profile.module.css';

// 쿠키 읽기 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const isLoggedIn = getCookie('isLoggedIn');

    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      window.location.href = '/login';
      return;
    }

    try {
      // 먼저 현재 로그인한 사용자 정보를 가져옴 (Header에서도 동일하게 호출)
      const userResponse = await api.get('/api/me');
      const currentUser = userResponse.data;

      // 백엔드 프로필 API에 맞춰서 이메일 파라미터로 프로필 정보 조회
      const profileResponse = await api.get(`/profile?email=${currentUser.email}`);
      console.log('프로필 정보:', profileResponse.data);
      setUser(profileResponse.data);

      // 검사 내역도 함께 가져오기
      const testResultResponse = await api.get(`/profile/test-result?email=${currentUser.email}`);
      console.log('검사 내역:', testResultResponse.data[0]);
      setTestResults(testResultResponse.data);
    } catch (err) {
      console.error('사용자 정보 가져오기 실패:', err.message);
      setError('사용자 정보를 불러오는 데 실패했습니다.');
      // 인증 실패시 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h1 className={styles.title}>프로필</h1>

        {user && (
          <div className={styles.userInfo}>
            <div className={styles.infoItem}>
              <strong>이름:</strong> {user.name}
            </div>
            <div className={styles.infoItem}>
              <strong>이메일:</strong> {user.email}
            </div>
            <div className={styles.infoItem}>
              <strong>가입일:</strong> {user.joinDate}
            </div>
          </div>
        )}

        {/* 검사 결과 리스트 */}
        {testResults && testResults.length > 0 && (
          <div className={styles.testResultsSection}>
            <h3>나의 검사 내역</h3>
            <div className={styles.testResults}>
              {testResults.map((result, index) => (
                <div
                  key={result.id || index}
                  className={styles.testResultItem}
                  onClick={() => window.location.href = `/profile/test-result?testId=${result.id}&email=${user.email}`}
                >
                  <div className={styles.testResultHeader}>
                    <span className={styles.testDate}>
                      {new Date(result.date).toLocaleDateString('ko-KR')} 검사
                    </span>
                    {/* <span className={styles.testId}>ID: {result.id}</span> */}
                  </div>
                  {/* <div className={styles.testResultSummary}>
                    <span className={styles.totalScore}>
                      총점: {(result.a + result.c + result.e + result.n + result.o)}점
                    </span>
                  </div> */}
                  <div className={styles.clickHint}>
                    클릭하여 상세 결과 보기 →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={() => window.location.href = '/testpage'}
          >
            Big5 테스트 하러가기
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => window.location.href = '/'}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
