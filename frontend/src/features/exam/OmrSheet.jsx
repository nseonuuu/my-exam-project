import { useEffect } from 'react';
import useExamStore from '../../store/useExamStore';

export default function OmrSheet({ correctAnswers }) {
  const { getCurrentExam, setAnswer } = useExamStore();
  const currentExam = getCurrentExam();

  if (!currentExam) return <p>시험을 선택해주세요.</p>;

  const { tabId, userAnswers, gradeResult, isGraded } = currentExam;

  // ── 키보드 입력 지원 ──────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 포커스된 셀의 index를 별도 ref로 관리하는 방식 권장
      // 여기서는 개념만 제시
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        // 현재 포커스된 문항에 답안 입력
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
              <td key={i} onClick={() => {
                const input = prompt(`${i + 1}번 답안 입력 (1~5)`);
                const num = parseInt(input);
                if (num >= 1 && num <= 5) setAnswer(tabId, i, num);
              }}>
                {ans ?? ''}
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