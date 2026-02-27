// 점수 계산 (기본: 1문항 2.5점, 40문항 100점 만점)
export const calculateScore = (userAnswers, correctAnswers) => {
  const pointPerQuestion = 100 / correctAnswers.length;

  const correct = userAnswers.filter(
    (ans, i) => ans !== null && ans === correctAnswers[i]
  ).length;

  return Math.round(correct * pointPerQuestion);
};

// 문항별 정오 배열 반환 → [true, false, true, null, ...]
export const getGradeResult = (userAnswers, correctAnswers) => {
  return userAnswers.map((ans, i) => {
    if (ans === null) return null;              // 미입력
    return ans === correctAnswers[i];           // true/false
  });
};