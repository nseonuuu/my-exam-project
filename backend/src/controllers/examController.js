const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 시험 목록 조회 (드롭다운용)
// 응답 예시: [{ id, category, year, subjects: [{ id, name, booklet }] }]
const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        subjects: {
          select: { id: true, name: true, booklet: true, passingScore: true },
          orderBy: [{ name: 'asc' }, { booklet: 'asc' }],
        },
      },
      orderBy: { year: 'desc' },
    });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// 특정 과목(+책형)의 문항/정답 목록 조회
// subjectId 자체가 이미 책형까지 특정하므로 그대로 사용
const getQuestions = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const questions = await prisma.question.findMany({
      where: { subjectId: Number(subjectId) },
      orderBy: { questionNumber: 'asc' },
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: '해당 과목/책형의 문항 데이터가 없습니다.' });
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

module.exports = { getExams, getQuestions };
