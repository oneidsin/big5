"use client";
import './result.css';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

/**
 * ResultPage
 * - 세션 스토리지(`big5_results`)에서 검사 결과를 읽음
 * - 막대그래프로 점수를 시각화하고, Gemini에서 받은 분석 텍스트는 Markdown으로 렌더링
 *
 * 데이터 흐름 요약:
 * 1. 검사 페이지에서 결과를 sessionStorage.setItem('big5_results', JSON.stringify({...}))로 저장
 * 2. ResultPage는 mounted 시 sessionStorage에서 읽어와 chartData와 analysis를 상태에 저장
 * 3. chartData는 Recharts에 공급되어 막대그래프를 그리며, analysis는 react-markdown으로 렌더링
 */
export default function ResultPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Next.js에서 서버 사이드 렌더링 시 window가 없으므로 안전하게 확인
    if (typeof window === 'undefined') return;

    // 검사 페이지에서 저장한 결과를 읽음
    const raw = sessionStorage.getItem('big5_results');
    if (!raw) return; // 결과가 없으면 아무 것도 하지 않음

    try {
      const parsed = JSON.parse(raw);
      const scores = parsed.scores || {};

      // Recharts가 기대하는 형태로 데이터 변환
      const chartData = [
        { category: 'E(외향성)', count: scores.E || 0 },
        { category: 'A(우호성)', count: scores.A || 0 },
        { category: 'C(성실성)', count: scores.C || 0 },
        { category: 'N(신경성)', count: scores.N || 0 },
        { category: 'O(개방성)', count: scores.O || 0 },
      ];

      // 상태에 차트 데이터와 분석 텍스트 저장
      setData({ chartData, analysis: parsed.analysis || '' });
    } catch (e) {
      // JSON 파싱 오류 등 예외 처리
      console.error('결과 파싱 실패', e);
    }
  }, []);

  // 데이터가 아직 준비되지 않았다면 간단한 안내 UI 반환
  if (!data) {
    return (
      <main className="result-main">
        <p>검사 결과가 없습니다.</p>
      </main>
    );
  }

  // 막대 색상(미리 정의된 팔레트)
  const pastelColors = ['#A8DADC', '#FFD6A5', '#C7CEEA', '#FFADAD', '#BDE0FE'];

  return (
    <div className="result-wrapper">
      {/* 페이지 제목 영역 */}
      <main className="result-main">빅5 성격 검사 결과</main>

      {/* 차트 영역: Recharts ResponsiveContainer로 반응형 처리 */}
      <div className="chart-area">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            {/* 배경 그리드 */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X, Y 축 설정 */}
            <XAxis dataKey="category" />
            <YAxis allowDecimals={false} />

            {/*
              툴팁 설정
              - formatter로 값(value)을 `${value} 점` 형식으로 변환
              - contentStyle로 툴팁 내부 스타일을 간단히 지정
            */}
            <Tooltip
              formatter={(value) => `${value} 점`}
              labelFormatter={(label) => label}
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #eef2f7',
                color: '#0b1020',
                fontSize: 14,
                borderRadius: 6,
                padding: '8px 10px'
              }}
              cursor={{ fill: '#f1f5f9' }}
            />

            {/* 데이터 막대: 각 막대에 색상을 적용 */}
            <Bar dataKey="count" name="점수">
              {data.chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pastelColors[index % pastelColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* react-markdown 으로 렌더링 */}
      {data.analysis && (
        <section className="analysis">
          <h2>성격 분석</h2>
          <div className="analysis-body">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]}>
              {data.analysis}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}