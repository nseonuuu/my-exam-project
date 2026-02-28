import { useEffect, useRef } from 'react';
import useExamStore from '../../store/useExamStore';

export default function OmrSheet({ onCorrectAnswerClick, selectedQuestionIndex }) {
  const { getCurrentExam, setAnswer } = useExamStore();
  const currentExam = getCurrentExam();
  const inputRefs = useRef([]);

  if (!currentExam) return <p>시험을 선택해주세요.</p>;

  const { tabId, userAnswers, gradeResult, isGraded, correctAnswers } = currentExam;

  // ── 키보드 입력 지원 ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGraded) return; // 채점 후 입력 차단

      const focused = document.activeElement;
      const index = inputRefs.current.indexOf(focused);
      if (index === -1) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        setAnswer(tabId, index, num);
        // 다음 칸으로 자동 이동
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        setAnswer(tabId, index, null);
      } else if (e.key === 'ArrowRight') {
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === 'ArrowLeft') {
        inputRefs.current[index - 1]?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabId, isGraded]);

  // 모범답안 셀: 스토어에서 읽기 (채점 전엔 빈 배열)
  const answerList = correctAnswers?.length > 0 ? correctAnswers : Array(40).fill(null);

  // 채점 결과 행: 채점 전엔 빈 배열
  const resultList = gradeResult?.length > 0 ? gradeResult : Array(40).fill(null);

  return (
    <div style={{ overflowX: 'auto', padding: '0 12px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ minWidth: '64px', textAlign: 'left', padding: '4px' }}>구분</th>
            {Array.from({ length: 40 }, (_, i) => (
              <th key={i} style={{ padding: '4px', minWidth: '32px' }}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 내 답안 행 */}
          <tr>
            <td style={{ fontWeight: 'bold', padding: '4px' }}>내 답안</td>
            {userAnswers.map((ans, i) => (
              <td key={i} style={{ padding: '2px' }}>
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  value={ans ?? ''}
                  readOnly
                  onClick={() => !isGraded && inputRefs.current[i]?.focus()}
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: '28px',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px 0',
                    cursor: isGraded ? 'default' : 'pointer',
                    background: ans ? '#eef2ff' : '#fff',
                    fontWeight: 'bold',
                  }}
                />
              </td>
            ))}
          </tr>

          {/* 모범 답안 행 — 채점 후 클릭 시 상세 분석 표시 */}
          <tr>
            <td style={{ fontWeight: 'bold', padding: '4px' }}>모범답안</td>
            {answerList.map((ans, i) => (
              <td
                key={i}
                onClick={() => isGraded && onCorrectAnswerClick?.(i)}
                style={{
                  textAlign: 'center',
                  padding: '4px 2px',
                  cursor: isGraded ? 'pointer' : 'default',
                  background: selectedQuestionIndex === i ? '#fef3c7' : 'transparent',
                  fontWeight: selectedQuestionIndex === i ? 'bold' : 'normal',
                  borderRadius: '4px',
                  transition: 'background 0.15s',
                }}
                title={isGraded ? `${i + 1}번 문항 상세 보기` : ''}
              >
                {isGraded ? ans : '-'}
              </td>
            ))}
          </tr>

          {/* 채점 결과 행 */}
          <tr>
            <td style={{ fontWeight: 'bold', padding: '4px' }}>결과</td>
            {resultList.map((result, i) => (
              <td key={i} style={{ textAlign: 'center', padding: '2px' }}>
                {result === null ? '' : result ? '✅' : '❌'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
