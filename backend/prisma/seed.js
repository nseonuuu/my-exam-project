const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 시험 생성
  const exam = await prisma.exam.create({
    data: { category: "5급 공채", year: 2024 }
  });

  // 과목 생성
  const subject = await prisma.subject.create({
    data: { examId: exam.id, name: "언어논리", passingScore: 80 }
  });

  // 문항 정답 입력 (1~40번, 정답은 실제 기출로 교체)
  const answers = [3, 2, 1, 4, 5, 3, 2, 1, 4, 5,
                   3, 2, 1, 4, 5, 3, 2, 1, 4, 5,
                   3, 2, 1, 4, 5, 3, 2, 1, 4, 5,
                   3, 2, 1, 4, 5, 3, 2, 1, 4, 5];

  for (let i = 0; i < answers.length; i++) {
    await prisma.question.create({
      data: {
        subjectId: subject.id,
        questionNumber: i + 1,
        correctAnswer: answers[i],
      }
    });
  }

  console.log("✅ Seed 데이터 입력 완료!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());