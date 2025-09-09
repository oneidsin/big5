'use client';

import { useState } from 'react';
import questions from '../data/ipip50';
import styles from './test.module.css';

export default function Big5Test() {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [answers, setAnswers] = useState({}); // 사용자의 답변 저장

  const questionsPerPage = 10; // 페이지당 문항 수
  const totalPages = Math.ceil(questions.length / questionsPerPage); // 전체 페이지 수

  // 현재 페이지에 표시할 질문들을 필터링하는 로직 추가
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // 다음 페이지로 이동하는 함수
  const handleNextPage = () => {
    if (!isCurrentPageComplete()) {
      alert('모든 문항에 답변해 주세요.');
      return;
    }
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동하는 함수
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 답변 선택 핸들러
  const handleAnswerChange = (questionsId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionsId]: value
    }));
  };

  // 현재 페이지의 모든 문항이 답변되었는지 확인
  const isCurrentPageComplete = () =>
    currentQuestions.every(q => answers[q.id] !== undefined);

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.title}>빅5 성격 검사</h1>

        {/* 문항 표시 */}
        <div className={styles.questions}>
          {currentQuestions.map((question) => (
            <div key={question.id} className={styles.question}>
              <p className={styles.questionText}>{question.id}. {question.text_ko}</p>
              {/* 답변 선택 라디오 버튼 */}
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

        {/* 페이지네이션 버튼 */}
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
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`${styles.btn} ${currentPage === totalPages ? styles.disabled : ''}`}
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
}
