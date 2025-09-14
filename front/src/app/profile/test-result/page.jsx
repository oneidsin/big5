"use client";
import './test-result.css';
import { useEffect, useState, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import api from '@/app/lib/axios';
import { useSearchParams } from 'next/navigation';

function ResultPageContent() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const testId = searchParams.get('testId');
    const email = searchParams.get('email');
    if (testId && email) {
      fetchTestResult(testId, email);
    }
  }, [searchParams]);

  // 검사 결과 API 요청
  const fetchTestResult = async (testId, email) => {
    try {
      const { data } = await api.get(`profile/test-result/detail?id=${testId}&email=${email}`);
      console.log('검사 결과:', data[0]);
      const result = data[0];

      // 차트 데이터 변환
      const chartData = [
        { category: '외향성', count: result.extraversion },
        { category: '친화성', count: result.agreeableness },
        { category: '성실성', count: result.conscientiousness },
        { category: '신경증', count: result.neuroticism },
        { category: '개방성', count: result.openness }
      ];

      // 변환된 데이터 설정
      setData({
        ...result,
        chartData,
        analysis: result.testResult
      });
    } catch (error) {
      console.error('검사 결과 가져오기 실패:', error);
    }
  };

  // 날짜 포맷터
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('ko-KR').replace(/ /g, '');
    const timePart = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${datePart} ${timePart}`;
  };

  // 막대 색상(미리 정의된 팔레트)
  const pastelColors = ['#A8DADC', '#FFD6A5', '#C7CEEA', '#FFADAD', '#BDE0FE'];

  return (
    <div className="result-wrapper">
      {/* 페이지 제목 영역 */}
      <main className="result-main">빅5 성격 검사 결과</main>
      <p>검사일 : {data && formatDate(data.testDate)}</p>

      {/* 차트 영역: 데이터가 로드된 경우에만 렌더링 */}
      {data && data.chartData && (
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
      )}

      {/* react-markdown 으로 렌더링: 데이터가 로드된 경우에만 */}
      {data && data.analysis && (
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

// 메인 컴포넌트 - Suspense로 래핑
export default function ResultPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResultPageContent />
    </Suspense>
  );
}