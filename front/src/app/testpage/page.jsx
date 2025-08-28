"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./test.module.css";
import QUESTIONS from "../data/ipip50"; // 질문 데이터를 가져옵니다.

// 로컬 스토리지에 답변을 저장할 때 사용할 키입니다.
const STORAGE_KEY = "ipip50_answers_v1";
// 한 페이지에 보여줄 질문의 수입니다.
const PER_PAGE = 10;

/**
 * 객체를 로컬 스토리지에 저장합니다. JSON 문자열로 변환하여 저장합니다.
 * @param {object} obj - 저장할 객체
 */
const saveToStorage = (obj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    // 로컬 스토리지 사용이 불가능한 경우(예: 시크릿 모드) 오류를 무시합니다.
  }
};

/**
 * 로컬 스토리지에서 저장된 답변을 불러옵니다.
 * @returns {object} - 저장된 답변 객체. 저장된 값이 없거나 파싱 오류 발생 시 빈 객체를 반환합니다.
 */
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};

/*
 * Big5 성격 특성(외향성, 우호성, 성실성, 정서적 안정성, 개방성)을 계산하기 위한 매핑입니다.
 * 각 특성은 긍정(+) 문항과 부정(-) 문항으로 나뉩니다.
 * 부정 문항은 점수를 역산하여 계산해야 합니다 (예: 1점 -> 5점, 2점 -> 4점).
 */
const traitMapping = {
  E_plus: [1, 11, 21, 31, 41], E_minus: [6, 16, 26, 36, 46], // 외향성 (Extraversion)
  A_plus: [7, 17, 27, 37, 42, 47], A_minus: [32, 12, 22, 2], // 우호성 (Agreeableness)
  C_plus: [3, 13, 23, 33, 43, 48], C_minus: [8, 18, 28, 38], // 성실성 (Conscientiousness)
  ES_plus: [9, 19], ES_minus: [4, 14, 24, 29, 34, 39, 44, 49], // 정서적 안정성 (Emotional Stability), N(신경성)의 반대
  O_plus: [5, 15, 25, 35, 40, 45, 50], O_minus: [10, 20, 30]  // 경험에 대한 개방성 (Openness to Experiences)
};

/**
 * 사용자의 답변을 기반으로 Big5 점수를 계산합니다.
 * @param {object} answers - 사용자의 답변 객체 (e.g., {1: 5, 2: 4, ...})
 * @returns {{E: number, A: number, C: number, N: number, O: number}} - 계산된 각 특성의 평균 점수
 */
function computeScores(answers) {
  // 특정 특성의 평균 점수를 계산하는 헬퍼 함수
  const avgScore = (plus, minus) => {
    let sum = 0, cnt = 0;
    // 긍정 문항 점수 합산 (답변이 없으면 중간값 3으로 처리)
    plus.forEach(q => { sum += (answers[q] ?? 3); cnt++; });
    // 부정 문항 점수 역산하여 합산 (6 - 점수)
    minus.forEach(q => { const v = answers[q] ?? 3; sum += (6 - v); cnt++; });
    // 평균 계산 후 소수점 셋째 자리까지 반올림
    return cnt === 0 ? 3 : +(sum / cnt).toFixed(3);
  };

  const E = avgScore(traitMapping.E_plus, traitMapping.E_minus);
  const A = avgScore(traitMapping.A_plus, traitMapping.A_minus);
  const C = avgScore(traitMapping.C_plus, traitMapping.C_minus);
  // 신경성(N)은 정서적 안정성(ES)의 반대이므로, ES_minus를 긍정 문항으로, ES_plus를 부정 문항으로 취급합니다.
  const N = avgScore(traitMapping.ES_minus, traitMapping.ES_plus);
  const O = avgScore(traitMapping.O_plus, traitMapping.O_minus);

  return { E, A, C, N, O };
}

// 성격 검사 페이지의 메인 컴포넌트
export default function TestPage() {
  // 5점 척도 텍스트 레이블
  const scaleLabels = {
    1: "매우 그렇지 않다",
    2: "약간 그렇지 않다",
    3: "보통이다",
    4: "약간 그렇다",
    5: "매우 그렇다",
  };

  // 현재 페이지 번호 (0부터 시작)
  const [page, setPage] = useState(0);
  // 사용자의 답변을 저장하는 상태
  const [answers, setAnswers] = useState({});
  // 전체 페이지 수
  const pageCount = Math.ceil(QUESTIONS.length / PER_PAGE);

  // 컴포넌트가 처음 마운트될 때 로컬 스토리지에서 답변을 불러옵니다.
  useEffect(() => {
    setAnswers(loadFromStorage());
  }, []);

  // `answers` 상태가 변경될 때마다 로컬 스토리지에 자동으로 저장합니다.
  useEffect(() => {
    saveToStorage(answers);
  }, [answers]);

  // 현재 페이지에 표시할 질문들을 계산합니다.
  const start = page * PER_PAGE;
  // `useMemo`를 사용하여 `page`가 변경될 때만 질문 목록을 다시 계산합니다.
  const pageItems = useMemo(() => QUESTIONS.slice(start, start + PER_PAGE), [page]);

  // 전체 질문 중 답변된 질문의 수
  const answeredCount = Object.keys(answers).length;
  // 검사 진행률 (백분율)
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  /**
   * 특정 질문에 대한 답변을 상태에 저장합니다.
   * @param {number} qId - 질문 ID
   * @param {number} val - 선택된 답변 값 (1-5)
   */
  const setAnswerValue = (qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }));

  // 현재 페이지의 모든 질문에 답변했는지 여부
  const isPageComplete = pageItems.every(q => typeof answers[q.id] === "number");

  // 다음 페이지로 이동
  const goNext = () => { if (page < pageCount - 1) setPage(p => p + 1); };
  // 이전 페이지로 이동
  const goPrev = () => { if (page > 0) setPage(p => p - 1); };

  // 검사 결과를 제출하는 함수
  const handleSubmit = () => {
    // 모든 문항에 답변하지 않았을 경우 확인 메시지를 표시합니다.
    if (Object.keys(answers).length < QUESTIONS.length) {
      if (!confirm("모든 문항에 답하지 않았습니다. 미응답 문항은 중립(3)으로 간주하여 제출할까요?")) return;
    }
    // 점수를 계산합니다.
    const scores = computeScores(answers);
    // 서버로 보낼 데이터를 구성합니다.
    const payload = { answers, scores, submittedAt: new Date().toISOString() };
    console.log("제출 페이로드:", payload); // 실제로는 이 데이터를 API로 전송해야 합니다.
    alert(`제출됨 — 콘솔을 확인하세요.\nE:${scores.E} A:${scores.A} C:${scores.C} N:${scores.N} O:${scores.O}`);
  };

  // 모든 답변을 초기화하는 함수
  const handleResetAll = () => {
    if (!confirm("저장된 답변을 모두 삭제하고 초기화할까요?")) return;
    localStorage.removeItem(STORAGE_KEY); // 로컬 스토리지에서 답변 삭제
    setAnswers({}); // 상태 초기화
    setPage(0); // 첫 페이지로 이동
  };

  // JSX 렌더링 부분
  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>빅5 성격검사 (IPIP-50)</h1>

      {/* 진행 상황 표시 */}
      <div className={styles.rowSpace}>
        <div className={styles.meta}>진행: <strong>{answeredCount}</strong> / {QUESTIONS.length} 문항</div>
        <div className={styles.meta}>페이지: <strong>{page + 1}</strong> / {pageCount}</div>
      </div>

      {/* 진행률 바 */}
      <div className={styles.progressWrap}><div className={styles.progressBar} style={{ width: `${progressPercent}%` }} /></div>

      {/* 질문 목록 */}
      <div className={styles.card}>
        {pageItems.map(q => (
          <div key={q.id} className={styles.qRow}>
            <div className={styles.qText}><strong>{q.id}.</strong> {q.text_ko ?? q.text}</div>
            <div className={styles.opts}>
              {/* 5점 척도 라디오 버튼 */}
              {[1, 2, 3, 4, 5].map(n => {
                const active = answers[q.id] === n;
                return (
                  <label key={n} className={`${styles.optLabel} ${active ? styles.optActive : ""}`}>
                    <input
                      type="radio"
                      name={"q" + q.id}
                      value={n}
                      checked={active}
                      onChange={() => setAnswerValue(q.id, n)}
                      className={styles.hiddenInput} // 실제 라디오 버튼은 숨김
                    />
                    {/* 시각적으로 표시되는 버튼 */}
                    <span className={styles.optBubble}>{n}</span>
                    <span className={styles.optLabelText}>{scaleLabels[n]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 이동 버튼 */}
      <div className={styles.controls}>
        <button onClick={goPrev} disabled={page === 0} className={styles.btn}>이전</button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => {
              // 현재 페이지의 모든 문항에 답하지 않았으면 경고 메시지를 표시합니다.
              if (!isPageComplete) {
                if (!confirm("이 페이지에 미응답 문항이 있습니다. 그래도 넘어가시겠습니까?")) return;
              }
              goNext();
            }}
            disabled={page === pageCount - 1}
            className={styles.btnPrimary}
          >
            다음
          </button>

          <button onClick={handleResetAll} className={styles.btnWarn}>전체 초기화</button>
        </div>
      </div>

      {/* 하단 페이지네이션 및 제출 버튼 */}
      <div className={styles.footerRow}>
        <div>
          {/* 페이지 번호 버튼들 */}
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`${styles.pageBtn} ${idx === page ? styles.pageBtnActive : ""}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div>
          <button onClick={handleSubmit} className={styles.btnSubmit}>전체 제출</button>
        </div>
      </div>
    </div>
  );
}

