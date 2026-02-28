const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const gradeExam = async ({ userId, subjectId, userAnswers }) => {
  // 1. DB에서 해당 과목의 정답 목록 가져오기
  const questions = await prisma.question.findMany({
    where: { subjectId: Number(subjectId) },
    orderBy: { questionNumber: 'asc' }
  });

  if (questions.length === 0) {
    throw new Error('해당 과목의 문항 데이터가 없습니다.');
  }

  // 2. 채점 계산
  let correctCount = 0;
  const gradedAnswers = questions.map((q, index) => {
    const submitted = userAnswers[index] ?? null;
    const isCorrect = submitted !== null && submitted === q.correctAnswer;
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      userAnswer: submitted,
      isCorrect,
    };
  });

  // 3. 점수 계산 (100점 만점 기준, 문항당 2.5점)
  const totalScore = Math.round((correctCount / questions.length) * 100);

  // 4. TestRecord 저장
  const record = await prisma.testRecord.create({
    data: {
      userId: Number(userId),
      subjectId: Number(subjectId),
      totalScore,
    }
  });

  // 5. UserAnswer 일괄 저장
  await prisma.userAnswer.createMany({
    data: gradedAnswers.map(a => ({
      recordId: record.id,
      questionId: a.questionId,
      userAnswer: a.userAnswer,
      isCorrect: a.isCorrect,
    }))
  });

  // 6. 저장된 UserAnswer를 다시 조회하여 answerId 포함
  const savedAnswers = await prisma.userAnswer.findMany({
    where: { recordId: record.id },
    orderBy: { question: { questionNumber: 'asc' } },
    select: { id: true, questionId: true, userAnswer: true, isCorrect: true },
  });

  return {
    recordId: record.id,
    totalScore,
    correctCount,
    totalCount: questions.length,
    details: savedAnswers.map(a => ({
      answerId: a.id,
      questionId: a.questionId,
      userAnswer: a.userAnswer,
      isCorrect: a.isCorrect,
    })),
  };
};

module.exports = { gradeExam };