"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import questions from '../data/ipip50';
import styles from './test.module.css';
import api from '../lib/axios';

export default function Big5Test() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleNextPage = () => {
    if (!isCurrentPageComplete()) {
      alert('모든 문항에 답변해 주세요.');
      return;
    }
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // 다음 버튼 클릭시 스크롤 맨 위로
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isCurrentPageComplete = () =>
    currentQuestions.every(q => answers[q.id] !== undefined);

  // 모든 문항이 답변되었는지 확인
  const isAllComplete = () =>
    questions.every(q => answers[q.id] !== undefined);

  // 점수 계산 함수 (리팩토링 후)
  const calculateScores = () => {
    const scores = { E: 0, A: 0, C: 0, N: 0, O: 0 };

    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        // 정방향(keyed: 1)이면 점수를 그대로 더하고,
        // 역방향(keyed: -1)이면 변환된 점수(6 - answer)를 더합니다.
        const score = q.keyed === 1 ? answer : 6 - answer;
        scores[q.factor] += score;
      }
    });

    return scores;
  };

  // 백엔드로 결과 전송
  const submitToBackend = async (scores) => {
    try {
      const { data } = await api.post('/api/gemini/explain', scores);
      console.log('빅5 결과 :', data);
      return data;
    } catch (error) {
      console.error('빅5 결과 전송 실패:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isAllComplete()) {
      alert('모든 문항에 답변해 주세요.');
      return;
    }

    const finalScores = calculateScores();
    console.log('최종 점수:', finalScores);

    try {
      // 백엔드로 점수 전송
      const analysisResult = await submitToBackend(finalScores);

      const payload = {
        scores: finalScores,
        analysis: analysisResult.explanation // 백엔드에서 explanation 필드로 응답
      };

      // 세션 스토리지에 결과 저장 후 /result로 이동
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('big5_results', JSON.stringify(payload));
      }
      router.push('/result');
    } catch (error) {
      alert('결과 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  if (isFinished) {
    return (
      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>검사 결과</h1>
          <div className={styles.results}>
            <p>당신의 빅5 성격 요인 점수는 다음과 같습니다.</p>
            <ul>
              <li>외향성 (E): {results.scores.E}점</li>
              <li>우호성 (A): {results.scores.A}점</li>
              <li>성실성 (C): {results.scores.C}점</li>
              <li>신경성 (N): {results.scores.N}점</li>
              <li>개방성 (O): {results.scores.O}점</li>
            </ul>
            {/* 백엔드에서 받은 분석 결과 표시 */}
            {results.analysis && (
              <div className={styles.analysis}>
                <h2>성격 분석</h2>
                <p>{results.analysis}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.title}>빅5 성격 검사</h1>
        <div className={styles.questions}>
          {currentQuestions.map((question) => (
            <div key={question.id} className={styles.question}>
              <p className={styles.questionText}>{question.id}. {question.text_ko}</p>
              <div className={styles.options}>
                {[1, 2, 3, 4, 5].map(val => (
                  <label key={val} className={styles.option}>
                    <input
                      type="radio"
                      name={`q${question.id}`}
                      value={val}
                      checked={answers[question.id] === val}
                      onChange={() => handleAnswerChange(question.id, val)}
                    />
                    <span>
                      {val === 1 && '전혀 그렇지 않다'}
                      {val === 2 && '그렇지 않다'}
                      {val === 3 && '보통이다'}
                      {val === 4 && '그렇다'}
                      {val === 5 && '매우 그렇다'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`${styles.btn} ${currentPage === 1 ? styles.disabled : ''}`}
          >
            이전
          </button>
          <span className={styles.pageInfo}>
            페이지 {currentPage} / {totalPages}
          </span>
          {currentPage === totalPages ? (
            <button onClick={handleSubmit} className={styles.btn}>
              결과 보기
            </button>
          ) : (
            <button
              onClick={handleNextPage}
              className={styles.btn}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </main>
  );
}