import { fetchCorrectAnswers, submitGrade } from '../../api/examApi';
import { calculateScore, getGradeResult } from '../../utils/calculate';
import useExamStore from '../../store/useExamStore';

export default function ResultSummary({ passingScore = 80 }) {
  const { getCurrentExam, setGraded, resetGrade } = useExamStore();
  const currentExam = getCurrentExam();

  const handleGrade = async () => {
    const filledCount = currentExam.userAnswers.filter((a) => a !== null).length;

    if (filledCount === 0) {
      alert('답안을 1개 이상 입력해주세요.');
      return;
    }

    // 1. 정답 데이터 가져오기 (객체 배열)
    const res = await fetchCorrectAnswers(currentExam.examInfo.subjectId);
    const questionData = res.data; // [{id, questionNumber, correctAnswer, questionType, globalCorrectRate}]
    const correctAnswerNumbers = questionData.map((q) => q.correctAnswer);

    // 2. 로컬에서 점수/정오 계산 (숫자 배열로 비교)
    const score = calculateScore(currentExam.userAnswers, correctAnswerNumbers);
    const gradeResult = getGradeResult(currentExam.userAnswers, correctAnswerNumbers);

    // 3. 백엔드에 결과 저장
    let gradeDetails = [];
    try {
      const gradeRes = await submitGrade({
        subjectId: currentExam.examInfo.subjectId,
        userAnswers: currentExam.userAnswers,
      });
      gradeDetails = gradeRes.data.details || [];
    } catch (err) {
      console.error('채점 결과 저장 실패:', err);
    }

    // 4. 스토어 업데이트
    setGraded(currentExam.tabId, {
      score,
      gradeResult,
      correctAnswers: correctAnswerNumbers,
      questionData,
      gradeDetails,
    });
  };

  const handleReset = () => {
    if (confirm('답안과 채점 결과가 모두 초기화됩니다. 계속하시겠습니까?')) {
      resetGrade(currentExam.tabId);
    }
  };

  if (!currentExam?.isGraded) {
    return (
      <button
        onClick={handleGrade}
        style={{
          padding: '10px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        채점하기
      </button>
    );
  }

  const diff = currentExam.score - passingScore;

  return (
    <div>
      <div style={{ fontSize: '18px', marginBottom: '8px' }}>
        <strong>{currentExam.score}점</strong>
        {diff >= 0
          ? ` / 합격선(${passingScore}점) 대비 ${diff}점 높습니다!`
          : ` / 합격선(${passingScore}점) 대비 ${Math.abs(diff)}점 부족합니다.`}
      </div>
      <button
        onClick={handleReset}
        style={{
          padding: '8px 16px',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        다시 채점하기
      </button>
    </div>
  );
}
