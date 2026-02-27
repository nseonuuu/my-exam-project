import { fetchCorrectAnswers, submitGrade } from '../../api/examApi';
import { calculateScore, getGradeResult } from '../../utils/calculate';
import useExamStore from '../../store/useExamStore';

export default function ResultSummary({ passingScore = 80 }) {
  const { getCurrentExam, setGraded } = useExamStore();
  const currentExam = getCurrentExam();

  const handleGrade = async () => {

    const filledCount = currentExam.userAnswers.filter((a) => a !== null).length;

    if (filledCount === 0) {
      alert('답안을 1개 이상 입력해주세요.');
      return;
    }

    // 1. 정답 데이터 가져오기
    const res = await fetchCorrectAnswers(currentExam.examInfo.subjectId);
    const correctAnswers = res.data;

    // 2. 로컬에서 점수/정오 계산
    const score = calculateScore(currentExam.userAnswers, correctAnswers);
    const gradeResult = getGradeResult(currentExam.userAnswers, correctAnswers);

    // 3. 스토어 업데이트
    setGraded(currentExam.tabId, score, gradeResult);

    // 4. 백엔드에 결과 저장
    await submitGrade({
      subjectId: currentExam.examInfo.subjectId,
      userAnswers: currentExam.userAnswers,
      score,
    });
  };

  if (!currentExam?.isGraded) {
    return <button onClick={handleGrade}>💯 채점하기</button>;
  }

  const diff = currentExam.score - passingScore;

  return (
    <div>
      <strong>{currentExam.score}점</strong>
      {diff >= 0
        ? ` / 합격선(${passingScore}점) 대비 ${diff}점 높습니다! 🎉`
        : ` / 합격선(${passingScore}점) 대비 ${Math.abs(diff)}점 부족합니다.`}
    </div>
  );
}