// src/pages/MainPage.jsx
import { useState } from 'react';
import useExamStore from '../store/useExamStore';
import MultiTabBoard from '../features/exam/MultiTabBoard';
import OmrSheet from '../features/exam/OmrSheet';
import ResultSummary from '../features/result/ResultSummary';
import QuestionDetail from '../features/result/QuestionDetail';

export default function MainPage() {
  const { activeExams, addTab } = useExamStore();

  // 드롭다운 선택 상태
  const [examInfo, setExamInfo] = useState({
    year: 2024,
    subject: '언어논리',
    booklet: '가',
    subjectId: 1,
  });

  const handleAddTab = () => {
    addTab(examInfo);
  };

  return (
    <div>
      {/* ── 상단 네비게이션 ── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #ccc' }}>
        <strong>📋 기출채점기</strong>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button>마이페이지</button>
          <button>오답노트</button>
          <button>로그아웃</button>
        </div>
      </nav>

      {/* ── 탭 네비게이션 ── */}
      <MultiTabBoard onAddTab={handleAddTab} />

      {/* ── 시험 선택 드롭다운 ── */}
      <div style={{ padding: '12px', display: 'flex', gap: '8px' }}>
        <select
          value={examInfo.year}
          onChange={(e) => setExamInfo({ ...examInfo, year: Number(e.target.value) })}
        >
          <option value={2024}>2024년</option>
          <option value={2023}>2023년</option>
          <option value={2022}>2022년</option>
        </select>

        <select
          value={examInfo.subject}
          onChange={(e) => setExamInfo({ ...examInfo, subject: e.target.value })}
        >
          <option value="언어논리">언어논리</option>
          <option value="자료해석">자료해석</option>
          <option value="상황판단">상황판단</option>
        </select>

        <select
          value={examInfo.booklet}
          onChange={(e) => setExamInfo({ ...examInfo, booklet: e.target.value })}
        >
          <option value="가">가형</option>
          <option value="나">나형</option>
        </select>
      </div>

      {/* ── 탭이 하나도 없을 때 안내 문구 ── */}
      {activeExams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          위에서 시험을 선택하고 <strong>+ 새 시험 추가</strong> 버튼을 눌러주세요.
        </div>
      )}

      {/* ── 탭이 있을 때 채점 보드 표시 ── */}
      {activeExams.length > 0 && (
        <>
          {/* 답안 입력 테이블 */}
          <OmrSheet correctAnswers={null} />

          {/* 채점하기 버튼 & 결과 요약 */}
          <div style={{ padding: '12px' }}>
            <ResultSummary passingScore={80} />
          </div>

          {/* 오답 상세 분석 */}
          <div style={{ padding: '12px' }}>
            <QuestionDetail questions={[]} />
          </div>
        </>
      )}
    </div>
  );
}