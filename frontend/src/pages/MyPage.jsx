import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { fetchScoreHistory, fetchTypeStats } from '../api/userApi';

export default function MyPage() {
  const [scoreHistory, setScoreHistory] = useState([]);
  const [typeStats, setTypeStats]       = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const load = async () => {
      const [histRes, typeRes] = await Promise.all([
        fetchScoreHistory(),
        fetchTypeStats(),
      ]);
      setScoreHistory(histRes.data);
      setTypeStats(typeRes.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h2>📈 나의 학습 통계</h2>

      {/* ── 차트 1: 과목별 점수 추이 ── */}
      <section>
        <h3>과목별 점수 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />        {/* 예: "2024-03-01" */}
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="언어논리" stroke="#4f46e5" />
            <Line type="monotone" dataKey="자료해석" stroke="#10b981" />
            <Line type="monotone" dataKey="상황판단" stroke="#f59e0b" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ── 차트 2: 유형별 오답 현황 ── */}
      <section style={{ marginTop: '40px' }}>
        <h3>유형별 오답 현황</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={typeStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" width={80} />
            {/* 예: type: "논리퀴즈", wrongCount: 7 */}
            <Tooltip />
            <Bar dataKey="wrongCount" name="오답 수">
              {typeStats.map((_, i) => (
                <Cell
                  key={i}
                  fill={i % 2 === 0 ? '#4f46e5' : '#818cf8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ── 요약 카드 ── */}
      <SummaryCards data={scoreHistory} />
    </div>
  );
}

// 총 응시 횟수, 최고 점수, 평균 점수 표시
function SummaryCards({ data }) {
  const allScores = data.flatMap((d) =>
    ['언어논리', '자료해석', '상황판단']
      .map((s) => d[s])
      .filter(Boolean)
  );
  const avg  = allScores.length
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;
  const best = allScores.length ? Math.max(...allScores) : 0;

  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
      {[
        { label: '총 응시 횟수', value: `${data.length}회` },
        { label: '최고 점수',    value: `${best}점` },
        { label: '평균 점수',    value: `${avg}점` },
      ].map((card) => (
        <div key={card.label} style={{
          flex: 1, padding: '16px', borderRadius: '8px',
          background: '#f5f3ff', textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280' }}>{card.label}</p>
          <strong style={{ fontSize: '24px', color: '#4f46e5' }}>
            {card.value}
          </strong>
        </div>
      ))}
    </div>
  );
}