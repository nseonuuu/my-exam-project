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

    // 1. 정답 데이터 가져오기 (객체 배열: [{id, correctAnswer, questionType, globalCorrectRate, ...}])
    const res = await fetchCorrectAnswers(currentExam.examInfo.subjectId);
    const questionData = res.data;
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

    // 4. 스토어 업데이트 (정답 번호 배열, 문항 상세, 채점 상세 포함)
    setGraded(currentExam.tabId, score, gradeResult, correctAnswerNumbers, questionData, gradeDetails);
  };

  const handleReset = () => {
    if (confirm('답안과 채점 결과가 모두 초기화됩니다. 계속하시겠습니까?')) {
      resetGrade(currentExam.tabId);
    }
  };

  if (!currentExam?.isGraded) {
    return <button onClick={handleGrade}>채점하기</button>;
  }

  const diff = currentExam.score - passingScore;

  return (
    <div>
      <div>
        <strong>{currentExam.score}점</strong>
        {diff >= 0
          ? ` / 합격선(${passingScore}점) 대비 ${diff}점 높습니다!`
          : ` / 합격선(${passingScore}점) 대비 ${Math.abs(diff)}점 부족합니다.`}
      </div>
      <div style={{ marginTop: '8px' }}>
        <button onClick={handleReset}>다시 채점하기</button>
      </div>
    </div>
  );
}
