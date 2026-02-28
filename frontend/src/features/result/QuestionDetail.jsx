import { useState } from 'react';
import { updateAnswerMemo } from '../../api/examApi';
import useExamStore from '../../store/useExamStore';

export default function QuestionDetail({ selectedQuestionIndex }) {
  const currentExam = useExamStore((s) => s.getCurrentExam());
  const [memo, setMemo] = useState({ difficulty: '중', importance: 1, memo: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!currentExam?.isGraded || selectedQuestionIndex === null || selectedQuestionIndex === undefined) {
    return null;
  }

  const { gradeResult, questionData, gradeDetails, userAnswers, correctAnswers } = currentExam;

  const q = questionData?.[selectedQuestionIndex];
  const detail = gradeDetails?.[selectedQuestionIndex];
  const result = gradeResult?.[selectedQuestionIndex];
  const userAnswer = userAnswers?.[selectedQuestionIndex];
  const correctAnswer = correctAnswers?.[selectedQuestionIndex];

  if (!q) return null;

  const handleSaveMemo = async () => {
    if (!detail?.answerId) {
      alert('저장할 수 없습니다. 채점 데이터가 없습니다.');
      return;
    }
    setSaving(true);
    try {
      await updateAnswerMemo(detail.answerId, memo);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      background: '#fafafa',
    }}>
      <h3 style={{ marginTop: 0 }}>
        {selectedQuestionIndex + 1}번 문항 상세 분석
      </h3>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <span>
          <strong>결과:</strong>{' '}
          {result === null ? '미입력' : result ? '✅ 정답' : '❌ 오답'}
        </span>
        <span>
          <strong>내 답:</strong> {userAnswer ?? '미입력'}
        </span>
        <span>
          <strong>정답:</strong> {correctAnswer}
        </span>
        {q.questionType && (
          <span>
            <strong>유형:</strong> {q.questionType}
          </span>
        )}
        {q.globalCorrectRate != null && (
          <span>
            <strong>전체 정답률:</strong> {q.globalCorrectRate}%
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
        <label>
          체감 난이도:{' '}
          <select
            value={memo.difficulty}
            onChange={(e) => setMemo((prev) => ({ ...prev, difficulty: e.target.value }))}
          >
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>
        </label>
        <label>
          중요도:{' '}
          <select
            value={memo.importance}
            onChange={(e) => setMemo((prev) => ({ ...prev, importance: Number(e.target.value) }))}
          >
            <option value={1}>⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
          </select>
        </label>
      </div>

      <textarea
        placeholder="풀이 과정이나 메모를 입력하세요"
        value={memo.memo}
        onChange={(e) => setMemo((prev) => ({ ...prev, memo: e.target.value }))}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
          resize: 'vertical',
        }}
      />

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleSaveMemo}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {saving ? '저장 중...' : '풀이 기록하기'}
        </button>
        {saved && <span style={{ color: 'green', fontWeight: 'bold' }}>저장 완료!</span>}
      </div>
    </div>
  );
}
