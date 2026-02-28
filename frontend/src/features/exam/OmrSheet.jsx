import { useEffect, useRef } from 'react';
import useExamStore from '../../store/useExamStore';

export default function OmrSheet({ correctAnswers }) {
  const { getCurrentExam, setAnswer } = useExamStore();
  const currentExam = getCurrentExam();
  const inputRefs = useRef([]);

  if (!currentExam) return <p>시험을 선택해주세요.</p>;

  const { tabId, userAnswers, gradeResult, isGraded } = currentExam;

  // ── 키보드 입력 지원 ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, [tabId]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>구분</th>
            {Array.from({ length: 40 }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 내 답안 행 */}
          <tr>
            <td>내 답안</td>
            {userAnswers.map((ans, i) => (
              <td key={i}>
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  value={ans ?? ''}
                  readOnly
                  onClick={() => inputRefs.current[i]?.focus()}
                  onFocus={(e) => e.target.select()}
                  style={{
                    width: '28px',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '2px 0',
                    cursor: 'pointer',
                    background: ans ? '#eef2ff' : '#fff',
                    fontWeight: 'bold',
                  }}
                />
              </td>
            ))}
          </tr>

          {/* 모범 답안 행 */}
          <tr>
            <td>모범 답안</td>
            {(correctAnswers ?? Array(40).fill(null)).map((ans, i) => (
              <td key={i}>{isGraded ? ans : '-'}</td>
            ))}
          </tr>

          {/* 채점 결과 행 */}
          <tr>
            <td>채점 결과</td>
            {gradeResult.map((result, i) => (
              <td key={i}>
                {result === null ? '' : result ? '✅' : '❌'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
